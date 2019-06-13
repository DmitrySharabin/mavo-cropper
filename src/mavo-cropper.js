(function ($) {
	const SELECTOR = '.cropper, [mv-cropper-options]';

	let defaults = {
		viewMode: 2,
		autoCrop: false,
		dragMode: 'none'
	};

	let options;

	Mavo.Plugins.register('cropper', {
		dependencies: [
			'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.1/cropper.min.css',
			'mv-cropper.css'
		],
		ready: $.include(self.cropper, 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.1/cropper.min.js'),
	});

	Mavo.Elements.register('cropper', {
		default: true,
		selector: SELECTOR,
		attribute: 'src',
		hasChildren: false,

		init: function () {

			options = this.element.getAttribute('mv-cropper-options');

			if (options) {
				options = $.extend(defaults, Mavo.options(options));
			} else {
				options = defaults;
			}
		},

		editor: function () {
			const self = this;
			let fileName;
			let fileType;

			if (typeof this.data !== 'undefined') {
				fileName = this.data.split('/').pop();
				fileType = 'image/' + (fileName.split('.')[1] === 'png' ? 'png' : 'jpeg');
			}

			// Listen to every change of the source image
			// and update the preview accordingly
			// That's a bit slow? Could we fix that?
			this.element.addEventListener('mv-change', evt => {
				fileName = this.data.split('/').pop();
				fileType = 'image/' + (fileName.split('.')[1] === 'png' ? 'png' : 'jpeg');
				this.cropper.replace(evt.value);
			});

			Mavo.setAttributeShy(this.element, 'mv-uploads', 'images');
			// Generate the default editor
			const popup = this.createUploadPopup('image/*', 'image', 'png');

			// and extend it with appropriate elements
			$.create('div', {
				// Wrap the image element with a block element (container)
				className: 'cropper-wrapper',
				contents: [{
					tag: 'img',
					src: this.data,
					alt: this.mavo._('cropper-image-preview'),
					className: 'cropper-preview',
					style: {
						maxWidth: this.element.offsetWidth + 'px'
					}
				}],
				inside: popup
			});

			// Create the cropper
			this.cropper = new Cropper($('.cropper-preview', popup), options);

			// Generate the cropper-bar depending on the cropper options: this.cropper.options
			$.create('div', {
				className: 'cropper-bar',
				contents: {
					tag: 'button',
					type: 'button',
					className: 'cropper-upload',
					title: this.mavo._('cropper-upload'),
					events: {
						click: () => {
							this.cropper.getCroppedCanvas(
								fileType === 'image/png' ? {} : { fillColor: '#fff' }
							).toBlob(file => {
								this.upload(file, fileName);
							}, fileType);
						}
					}
				},
				inside: popup
			});

			// Crop
			$.create('button', {
				type: 'button',
				className: 'cropper-crop cropper-crop-hide',
				title: this.mavo._('cropper-show'),
				events: {
					click: function() {
						this.classList.toggle('cropper-crop-hide');
						if (this.classList.contains('cropper-crop-hide')) {
							this.setAttribute('title', self.mavo._('cropper-show'));
							self.cropper.setDragMode();
							self.cropper.clear();
						} else {
							this.setAttribute('title', self.mavo._('cropper-hide'));
							self.cropper.setDragMode('crop');
							self.cropper.crop();
						}
					}
				},
				inside: $('.cropper-bar', popup)
			});

			// Rotate
			if (this.cropper.options.rotatable) {
				$.create('button', {
					type: 'button',
					className: 'cropper-rotate-left',
					title: this.mavo._('cropper-rotate-left'),
					events: {
						click: () => {
							this.cropper.rotate(-90);
						}
					},
					inside: $('.cropper-bar', popup)
				});
				$.create('button', {
					type: 'button',
					className: 'cropper-rotate-right',
					title: this.mavo._('cropper-rotate-right'),
					events: {
						click: () => {
							this.cropper.rotate(90);
						}
					},
					inside: $('.cropper-bar', popup)
				});
			}

			// Flip
			if (this.cropper.options.scalable) {
				$.create('button', {
					type: 'button',
					className: 'cropper-flip-horizontal',
					title: this.mavo._('cropper-flip-horizontal'),
					events: {
						click: () => {
							this.cropper.scaleX(-this.cropper.getData().scaleX || -1);
						}
					},
					inside: $('.cropper-bar', popup)
				});
				$.create('button', {
					type: 'button',
					className: 'cropper-flip-vertical',
					title: this.mavo._('cropper-flip-vertical'),
					events: {
						click: () => {
							this.cropper.scaleY(-this.cropper.getData().scaleY || -1);
						}
					},
					inside: $('.cropper-bar', popup)
				});
			}

			// TODO: Modify the behaviour of the default editor: we don't want to upload an image
			// before it is edited

			// Show an end user the editor
			return popup;
		}
	});

	// Think of localization from the very beginning :)
	Mavo.Locale.register('en', {
		'cropper-image-preview': 'Image preview',
		'cropper-upload': 'Upload',
		'cropper-show': 'Show Crop Box',
		'cropper-hide': 'Hide Crop Box',
		'cropper-rotate-left': 'Rotate Left',
		'cropper-rotate-right': 'Rotate Right',
		'cropper-flip-horizontal': 'Flip Horizontal',
		'cropper-flip-vertical': 'Flip Vertical'
	});

})(Bliss);
