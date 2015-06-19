
##多级下拉框插件 Selects

---

##Basic 基本

依赖：jquery

调用：
- `$element.selects(options)


##Options 参数

#####data
*array* / *string* 显示的数据

```
// value作为option的value，text作为文本，attr作为属性
[{
    value: 1,
    text: '行政部',
    attr: {
        staff: 12
    },
    children: [{
        value: 11,
        text: '关怀组',
        attr: {
            staff: 2
        }
    }]
}]
```

#####template
*string* ('<select class="form-control input-sm selects-select">%option%</select>') 下拉框的模版

#####selected
*string* ('') 默认选中的值

#####container
*selector* ('') 下拉框dom容器，默认为空，则放在$element的后面

#####preOption
*string* ('<option value="">--请选择--</option>') 添加到最前面的选项

#####allowEmpty
*boolean* (false) 子下拉框还未选择的情况，是否都将父下拉框的值作为最终的值

#####setInputValue
*function* 将下拉框的值设置回$element

```
function($input, items){
            
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
}
```

#####onChange
*function* ($.noop) 改变下拉框的回调

```
function($modal){
	//$modal为显示的内容的jquery实例
}
```



##method 方法

#####initSelect
```
// 初始化选中的值
var mySelect = $('input').selects(options).data('selects')
mySelect.initSelect(selected)

```
