!function(e){Mavo.Plugins.register("cropper",{dependencies:["https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.1/cropper.min.js","https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.1/cropper.min.css","mv-cropper.css"],hooks:{"primitive-createuploadpopup-beforereturn":function(p){if("image"===p.kind){const t={viewMode:2,autoCrop:!1},o=this;this.options=this.element.getAttribute("mv-cropper-options"),this.options?this.options=e.extend(t,Mavo.options(this.options)):this.options=t,void 0===this.data&&p.popup.classList.add("cropper-no-image"),e.create("div",{className:"cropper-wrapper",contents:[{tag:"img",src:this.data||"",alt:this.mavo._("cropper-image-preview"),className:"cropper-preview",style:{maxWidth:this.element.offsetWidth+"px"}}],inside:p.popup}),this.cropper=new Cropper(e(".cropper-preview",p.popup),this.options),e.create("div",{className:"cropper-bar",contents:{tag:"button",type:"button",className:"cropper-upload",title:this.mavo._("cropper-upload"),events:{click:()=>{this.fileName=this.element.src.split("/").pop(),this.fileType="image/"+("png"===this.fileName.split(".")[1]?"png":"jpeg"),this.cropper.getCroppedCanvas("image/png"===this.fileType?{}:{fillColor:"#fff"}).toBlob(e=>{this.upload(e,this.fileName),this.updatePreview()},this.fileType)}}},inside:p.popup}),e.create("button",{type:"button",className:"cropper-crop",events:{click:function(){this.classList.toggle("cropper-crop-hidden"),this.classList.contains("cropper-crop-hidden")?(this.setAttribute("title",o.mavo._("cropper-show")),e(".cropper-aspect-ratio",p.popup).disabled=!0,o.cropper.setDragMode(),o.cropper.clear()):(this.setAttribute("title",o.mavo._("cropper-hide")),e(".cropper-aspect-ratio",p.popup).disabled=!1,o.cropper.setDragMode("crop"),o.cropper.crop())}},inside:e(".cropper-bar",p.popup)}),e.create("select",{className:"cropper-aspect-ratio",title:this.mavo._("cropper-aspect-ratio"),contents:[{tag:"option",value:NaN,textContent:"Free"},{tag:"option",value:1,textContent:"1:1"},{tag:"option",value:4/3,textContent:"4:3"},{tag:"option",value:16/9,textContent:"16:9"},{tag:"option",value:2/3,textContent:"2:3"}],events:{change:e=>{"custom"===e.target.value?this.cropper.setAspectRatio(this.options.aspectRatio):this.cropper.setAspectRatio(e.target.value)}},inside:e(".cropper-bar",p.popup)}),this.cropper.options.rotatable&&(e.create("button",{type:"button",className:"cropper-rotate-left",title:this.mavo._("cropper-rotate-left"),events:{click:()=>{this.cropper.rotate(-90)}},inside:e(".cropper-bar",p.popup)}),e.create("button",{type:"button",className:"cropper-rotate-right",title:this.mavo._("cropper-rotate-right"),events:{click:()=>{this.cropper.rotate(90)}},inside:e(".cropper-bar",p.popup)})),this.cropper.options.scalable&&(e.create("button",{type:"button",className:"cropper-flip-horizontal",title:this.mavo._("cropper-flip-horizontal"),events:{click:()=>{this.cropper.scaleX(-this.cropper.getData().scaleX||-1)}},inside:e(".cropper-bar",p.popup)}),e.create("button",{type:"button",className:"cropper-flip-vertical",title:this.mavo._("cropper-flip-vertical"),events:{click:()=>{this.cropper.scaleY(-this.cropper.getData().scaleY||-1)}},inside:e(".cropper-bar",p.popup)})),this.cropper.options.autoCrop?(e.set(e(".cropper-crop",p.popup),{className:"cropper-crop",title:this.mavo._("cropper-hide")}),e.set(e(".cropper-aspect-ratio",p.popup),{disabled:!1}),this.cropper.options.aspectRatio&&e.set(document.createElement("option"),{value:"custom",textContent:"Custom",selected:!0,start:e(".cropper-aspect-ratio",p.popup)}),this.cropper.setDragMode(this.cropper.options.dragMode)):(e.set(e(".cropper-crop",p.popup),{className:"cropper-crop cropper-crop-hidden",title:this.mavo._("cropper-show")}),e(".cropper-aspect-ratio",p.popup).disabled=!0,this.cropper.options.dragMode="none"),e.bind(p.popup,"paste drop",()=>{this.updatePreview()}),e.bind(this.element,"paste drop",()=>{this.updatePreview()}),e.bind(e("input[type=url]",p.popup),"input",()=>{this.updatePreview()}),e.bind(e("input[type=file]",p.popup),"change",()=>{this.updatePreview()}),this.updatePreview=()=>{this.element.src?(e(".cropper-preview",p.popup).style.maxWidth=this.element.offsetWidth+"px",this.cropper.replace(this.element.src),e("button.cropper-crop",e(".cropper-bar",p.popup)).classList.contains("cropper-crop-hidden")||(this.cropper.options.dragMode="none",e.fire(e("button.cropper-crop",e(".cropper-bar",p.popup)),"click")),this.cropper.options.autoCrop&&(this.cropper.options.dragMode="crop",e.fire(e("button.cropper-crop",e(".cropper-bar",p.popup)),"click")),p.popup.classList.remove("cropper-no-image")):p.popup.classList.add("cropper-no-image")}}}}}),Mavo.Locale.register("en",{"cropper-image-preview":"Image preview","cropper-upload":"Upload","cropper-show":"Show Crop Box","cropper-hide":"Hide Crop Box","cropper-rotate-left":"Rotate Left","cropper-rotate-right":"Rotate Right","cropper-flip-horizontal":"Flip Horizontal","cropper-flip-vertical":"Flip Vertical","cropper-aspect-ratio":"Crop Box Aspect Ratio"})}(Bliss);