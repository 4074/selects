/**
 * 多级下拉框效果
 * author: dengwenfeng
 * date: 2015-06-19
 * github: https://github.com/4074
 */

+ function(factory){
    
    if(typeof define == 'function' && define.amd){
        define(['jquery'], function($){
            factory($)
        })
    }else{
        factory(jQuery)
    }
    
}(function($){
    
    var Selects = function(element, options){
        this.$element = $(element)
        this.options = options
        
        if(!this.options.data) return;
        
        if(typeof this.options.data == 'string'){
            $.get(this.options.data, function(rs){
                this.options.data = rs
                this.init()
            }, 'json')
        }else{
            this.init()
        }
    }
    
    Selects.defaults = {
        template: '<select class="form-control input-sm selects-select">%option%</select>',
        container: '',
        preOption: '<option value="">--请选择--</option>',
        allowEmpty: false,
        setInputValue: function($input, items){
            
            var value 
            
            if(this.options.allowEmpty){
                for(var i=items.length-1; i>=0; i--){
                    value = items[i].value
                    if(value) break;
                }
            }else{
                value = items.length ? items[items.length - 1].value : ''
            }
            
            $input.val(value)
        },
        onChange: $.noop
    }
    
    // 插件初始化
    Selects.prototype.init = function(){
        
        var $container
        
        //this.$element.hide()
        this.$wrap = $('<span class="selects-wrap">')
        if(this.options.container && ($container = $(this.options.container)).length ){
            $container.append(this.$wrap)
        }else{
            this.$wrap.insertAfter(this.$element)
        }
        
        this.listen()
        
        this.options.selected = this.options.selected || this.$element.val() || ''
        this.$element.val(this.options.selected)
        this.initSelect(this.options.selected)
        
    }
    
    // 初始化下拉框
    Selects.prototype.initSelect = function(selected){
        var self = this
        var selectItems = this.findItemFromData(selected)
        
        if(selectItems.length){
            $.each(selectItems, function(key, val){
                self.createSelect(key == 0 ? self.options.data : selectItems[key-1].children, val.value)
            })
        }else{
            this.createSelect(this.options.data)
        }
        
        if(!this.options.allowEmpty){
            this.$wrap.find('.selects-select').last().trigger('change')
        }
    }
    
    // 创建下拉框
    Selects.prototype.createSelect = function(items, selected){
        if(items.length){
            var selectHtml = this.getSelectHtml(items, selected)
            this.$wrap.append($(selectHtml))
        }
    }
    
    // 创建下级下拉框
    Selects.prototype.createChildrenSelect = function(value, selected){
        
        var items = []
        
        if(!value){
            items = this.options.data
        }else{
            var selectItems = this.findItemFromData(value)
            
            if(selectItems && selectItems[selectItems.length - 1].children){
                items = selectItems[selectItems.length - 1].children
            }
        }
        
        this.createSelect(items, selected)
    }
    
    // 查找被选中的数据项
    Selects.prototype.findItemFromData = function(value){
        var self = this
        var result = {}
        
        this.findItemLoop(value, this.options.data, result)
        result = result.match ? Array.prototype.slice.call(result, 0) : []
        
        return result
    }
    
    // 查找的循环
    Selects.prototype.findItemLoop = function(value, data, result, deep){
        var self = this
        
        deep === undefined && (deep = 0)
        
        $.each(data, function(key, item){
            
            if(result.match) return false;
            
            result[deep] = item
            result.length = deep + 1
            
            if(item.value == value){
                result.match = true
                return false
            }else if(item.children && item.children.length){
                self.findItemLoop(value, item.children, result, deep + 1)   
            }
        })
        
    }
    
    // 获取下拉框html
    Selects.prototype.getSelectHtml = function(items, selectValue){
        var options = [], attrs = []
        var optionTemplate = '<option value="%value%" %attr% %selected%>%text%</option>'
        
        if(this.options.preOption){
            options.push(this.options.preOption)
        }
        
        $.each(items, function(key, val){
            attrs = []
            val.attr && typeof val.attr == 'object' && $.each(val.attr, function(attrKey, attrValue){
                attrs.push(attrKey + '="' + attrValue + '"')
            })
            
            var selected = selectValue !== undefined && selectValue == val.value ? 'selected' : ''
            
            options.push(
                optionTemplate
                .replace(/%value%/, val.value)
                .replace(/%text%/, val.text)
                .replace(/%selected%/, selected)
                .replace(/%attr%/, attrs.join(' '))
            )
        })
        
        return this.options.template.replace(/%option%/, options.join(''))
    }
    
    // 绑定事件监听
    Selects.prototype.listen = function(){
        var self = this
        this.$wrap.on('change', '.selects-select', function(){
            var $this = $(this)
            var selectValue = $this.val()
            var selectItems = []
            
            $this.nextAll('.selects-select').remove()
            selectValue && self.createChildrenSelect(selectValue)
            
            self.$wrap.find('.selects-select').each(function(){
                var value = $(this).val()
                if(value){
                    selectItems = self.findItemFromData(value)
                }else{
                    selectItems.push({
                        value: ''
                    })
                }
            })
            
            self.options.setInputValue.call(self, self.$element, selectItems)
            self.options.onChange.call(self)
        })
    }
    
    // 插件定义
    $.fn.selects = function(option){
        if('string number'.indexOf(typeof option) >=0){
            option = {
                selected: option
            }
        }
        var options = $.extend(Selects.defaults, option, {})
        
        return $(this).each(function(){
            $(this).data('selects', new Selects(this, options))
        })
    }
    
})