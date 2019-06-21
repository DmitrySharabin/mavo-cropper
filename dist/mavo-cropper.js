(function ($) {

	const defaults = {
		viewMode: 2,
		autoCrop: false
	};

	Mavo.Plugins.register('cropper', {
		dependencies: [
			'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.1/cropper.min.js',
			'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.1/cropper.min.css',
			'mv-cropper.css'
		],
		hooks: {
			// TODO: Modify the behaviour of the default editor: we don't want to upload an image
			// before it is edited
			'primitive-createuploadpopup-beforereturn': function (env) {
				if (env.kind === 'image') {
					const self = this;

					this.options = this.element.getAttribute('mv-cropper-options');

					if (this.options) {
						this.options = $.extend(defaults, Mavo.options(this.options));
					} else {
						this.options = defaults;
					}

					if (typeof this.data !== 'undefined') {
						this.fileName = this.data.split('/').pop();
						this.fileType = 'image/' + (this.fileName.split('.')[1] === 'png' ? 'png' : 'jpeg');

						env.popup.classList.remove('cropper-no-image');
					} else {
						// What if there is no image? No problem, just hide the preview and the toolbar
						env.popup.classList.add('cropper-no-image');
					}

					// Listen to every change of the source image
					// and update the preview accordingly
					// That's a bit slow. Could we fix that?
					this.element.addEventListener('mv-change', evt => {
						if (evt.value !== '') {
							this.fileName = evt.value.split('/').pop();
							this.fileType = 'image/' + (this.fileName.split('.')[1] === 'png' ? 'png' : 'jpeg');

							$('.cropper-preview', env.popup).style.maxWidth = this.element.offsetWidth + 'px';
							this.cropper.replace(evt.value);

							// TODO: We need to update the toolbar according to the cropper options
							env.popup.classList.remove('cropper-no-image');
						} else {
							env.popup.classList.add('cropper-no-image');
						}
					});

					// Extend the default editor with appropriate elements:
					// a preview and a toolbar
					$.create('div', {
						// Wrap the image element with a block element (container)
						className: 'cropper-wrapper',
						contents: [{
							tag: 'img',
							src: this.data || '',
							alt: this.mavo._('cropper-image-preview'),
							className: 'cropper-preview',
							style: {
								maxWidth: this.element.offsetWidth + 'px'
							}
						}],
						inside: env.popup
					});

					// Create the cropper
					this.cropper = new Cropper($('.cropper-preview', env.popup), this.options);

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
										this.fileType === 'image/png' ? {} : {
											fillColor: '#fff'
										}
									).toBlob(file => {
										this.upload(file, this.fileName);
									}, this.fileType);
									// TODO: We need to update the toolbar according to the options the cropper had had before we uploaded the image
								}
							}
						},
						inside: env.popup
					});

					// Crop
					$.create('button', {
						type: 'button',
						className: 'cropper-crop',
						events: {
							click: function () {
								this.classList.toggle('cropper-crop-hidden');
								if (this.classList.contains('cropper-crop-hidden')) {
									this.setAttribute('title', self.mavo._('cropper-show'));
									$('.cropper-aspect-ratio', env.popup).style.visibility = 'hidden';
									self.cropper.setDragMode();
									self.cropper.clear();
								} else {
									this.setAttribute('title', self.mavo._('cropper-hide'));
									$('.cropper-aspect-ratio', env.popup).style.visibility = 'visible';
									self.cropper.setDragMode('crop');
									self.cropper.crop();
								}
							}
						},
						inside: $('.cropper-bar', env.popup)
					});

					// Aspect Ratio
					$.create('select', {
						className: 'cropper-aspect-ratio',
						title: this.mavo._('cropper-aspect-ratio'),
						contents: [{
								tag: 'option',
								value: NaN,
								textContent: 'Free'
							},
							{
								tag: 'option',
								value: 1,
								textContent: '1:1'
							},
							{
								tag: 'option',
								value: 4 / 3,
								textContent: '4:3'
							},
							{
								tag: 'option',
								value: 16 / 9,
								textContent: '16:9'
							},
							{
								tag: 'option',
								value: 2 / 3,
								textContent: '2:3'
							}
						],
						events: {
							change: evt => {
								if (evt.target.value === 'user') {
									this.cropper.setAspectRatio(this.options.aspectRatio);
								} else {
									this.cropper.setAspectRatio(evt.target.value);
								}
							}
						},
						inside: $('.cropper-bar', env.popup)
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
							inside: $('.cropper-bar', env.popup)
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
							inside: $('.cropper-bar', env.popup)
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
							inside: $('.cropper-bar', env.popup)
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
							inside: $('.cropper-bar', env.popup)
						});
					}

					// Tune the cropper bar according to the cropper options
					if (this.cropper.options.autoCrop) {
						$.set($('.cropper-crop', env.popup), {
							className: 'cropper-crop',
							title: this.mavo._('cropper-hide'),
						});
						$.set($('.cropper-aspect-ratio', env.popup), {
							style: {
								visibility: 'visible'
							}
						});
						// If a user defined a custom aspect ratio,
						// add the corresponding option to the list of the predefined aspect ratios,
						// and make it selected
						if (this.cropper.options.aspectRatio) {
							$.set(document.createElement('option'), {
								value: 'user',
								textContent: 'User Defined',
								selected: true,
								start: $('.cropper-aspect-ratio', env.popup)
							});
						}
						this.cropper.setDragMode(this.cropper.options.dragMode);
					} else {
						$.set($('.cropper-crop', env.popup), {
							className: 'cropper-crop cropper-crop-hidden',
							title: this.mavo._('cropper-show'),
						});
						$('.cropper-aspect-ratio', env.popup).style.visibility = 'hidden';
						// That's weird: this.cropper.setDragMode() doesn't work in that case.
						// I have to use this workaround
						$.extend(this.cropper.options, {
							dragMode: 'none'
						});
					}
				}
			}
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
		'cropper-flip-vertical': 'Flip Vertical',
		'cropper-aspect-ratio': 'Crop Box Aspect Ratio'
	});

})(Bliss);
