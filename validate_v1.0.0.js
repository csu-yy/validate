/**
 * Author SkyeGao.
 * Date   2016/12/1
 * version v1.0.0.
 */
;void(function(window,docuemnt,undefined){
    if(!(typeof validate !="undefined" && validate)){
        var validate = window.validate = {};

        validate.default = {
            blurCustom:true,                //失去焦点验证开启
            styleCustom:true,               //样式定制化按钮
            tipsId:0,                       //tips起始ID
            warningBorderColor:"#ff0000",   //input警告边框颜色
            tipsBackgroundColor:"#ff0000",  //提示框背景颜色
            tipsTxtColor:"#fff"             //提示框字体颜色
        };
        //验证初始入口
        validate.doValidate = function(select,config,callback){
            //合并参数
            if(config!=""){
                if(config.hasOwnProperty('warningBorderColor')){
                    this.default.warningBorderColor = config.warningBorderColor;
                }
                if(config.hasOwnProperty('tipsBackgroundColor')){
                    this.default.tipsBackgroundColor = config.tipsBackgroundColor;
                }
                if(config.hasOwnProperty('tipsTxtColor')){
                    this.default.tipsTxtColor = config.tipsTxtColor;
                }
            }
            if(this.default.styleCustom){
                var styleStr = '@-webkit-keyframes bounceIn{0%{opacity:0;-webkit-transform:scale(.5);transform:scale(.5)}100%{opacity:1;-webkit-transform:scale(1);transform:scale(1)}}@keyframes bounceIn{0%{opacity:0;-webkit-transform:scale(.5);-ms-transform:scale(.5);transform:scale(.5)}100%{opacity:1;-webkit-transform:scale(1);-ms-transform:scale(1);transform:scale(1)}}.validate-tips{-webkit-animation-name:bounceIn;animation-name:bounceIn;-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation-duration:.3s;animation-duration:.3s;line-height:22px;min-width:12px;padding:5px 10px;font-size:12px;_float:left;border-radius:3px;box-shadow:1px 1px 3px rgba(0,0,0,.3);background-color:'+this.default.tipsBackgroundColor+';color:'+this.default.tipsTxtColor+';display:inline-block;z-index:19910711;position:absolute}.validate-tips-i{left:-8px;top:1px;border-color:transparent;border-style:dashed;border-bottom-style:solid;border-bottom-color:'+this.default.tipsBackgroundColor+';position:absolute;width:0;height:0;border-width:8px}';
                var tipStyle = document.createElement('style');
                tipStyle.type = 'text/css';
                tipStyle.innerHTML = styleStr;
                document.body.appendChild(tipStyle);
            }
            if(this.default.blurCustom){
                this.validateBlur(".validate");
            }
            var that = this;
            document.querySelector(select).onclick = function(){
                var validateResult = that.validateSubmit(".validate");
                if(!validateResult){
                    return false;
                }
                if(callback){//验证成功回调函数
                    callback(this);
                }
            };
        };
        //失去焦点验证 TODO
        validate.validateBlur = function(select){};

        //提交验证
        validate.validateSubmit = function(select){
            var that = this;
            var validateResult = true;
            var vDom = document.querySelectorAll(select);
            var i = 0,l = vDom.length;
            for(;i<l;i+=1){
                var validateBlurEmptyResult = that.validateBlurEmpty(vDom[i]);//非空验证结果
                if(!validateBlurEmptyResult){//验证未通过
                    validateResult = false;
                    continue;
                }
            }
            return validateResult;
        };
        //验证是否为空
        validate.validateBlurEmpty = function(vDom){
            if(!vDom.dataset){//兼容待做 TODO

            }else{
                var vAttribute = vDom.dataset.required == "false" || vDom.dataset.required == "" ? false:true;
                var vInfoid = vDom.dataset.infoid || "";
                var vInfoTxt = vDom.dataset.requiredinfo || "";
            }
            if(!vAttribute){//验证通过
                return true;
            }else{
                if(vDom.value == "" || vDom.value =="-1"){//验证不通过
                    this.close(vInfoid);
                    vDom.style.borderColor = this.default.warningBorderColor;
                    var tipsId = this.createTips({
                        el:vDom,
                        content:vInfoTxt
                    });
                    vDom.setAttribute("data-infoid",tipsId);
                    return false;
                }else{//验证通过
                    this.close(vInfoid);
                    vDom.style.borderColor = "";
                    return true;
                }
            }
        };

        //创建信息提示框
        validate.createTips = function(obj){
            var vTipsDom = this.createTipsDom({
                marginLeft:"8px",
                content:obj.content || "　"
            });
            obj.el.parentNode.appendChild(vTipsDom.vTips);//控制提示框出现的位置
            return vTipsDom.tipsId;
        };

        //获取dom位置
        validate.getPosition = function(vDom){
            var sTop=document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop;
            var vDomLeft = vDom.getBoundingClientRect().left;//var vDomTop = vDom.getBoundingClientRect().top;
            var vDomTop = vDom.getBoundingClientRect().top + sTop;
            var vDomHeight = vDom.clientHeight;
            var vDomWidth = vDom.clientWidth;
            return {
                left:vDomLeft+vDomWidth+10,
                top:vDomTop,
                height:vDomHeight,
                width:vDomWidth
            }
        };

        //创建弹层DOM
        validate.createTipsDom = function(obj){
            var vTipsDiv = document.createElement("div");
            vTipsDiv.id = "validate"+this.default.tipsId;
            this.default.tipsId++;
            vTipsDiv.className = "validate-tips";
            vTipsDiv.style.marginLeft = obj.marginLeft;
            vTipsDiv.innerHTML = obj.content;
            var vTipsI = document.createElement("i");
            vTipsI.className = "validate-tips-i";
            vTipsDiv.appendChild(vTipsI);
            return {
                vTips:vTipsDiv,
                tipsId:this.default.tipsId-1
            }
        };

        //关闭信息提示框 TODO
        validate.close = function(id){};

    }
})(this,this.document);
