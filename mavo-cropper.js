(function ($, $$) {
	const SELECTOR = '.cropper, [mv-cropper-options]';

	let defaults = {
		viewMode: 3
	};

	let options;

	Mavo.Plugins.register('cropper', {
		dependencies: [
			'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.1/cropper.min.css'
		],
		ready: $.include(self.cropper, 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.1/cropper.min.js')
	});

	Mavo.Elements.register('cropper', {
		default: true,
		selector: SELECTOR,
		attribute: 'src',
		hasChildren: false,

		// extend: {
		// 	'media': {
		// 		selector: SELECTOR
		// 	},
		// },

		init: function () {

			options = this.element.getAttribute('mv-cropper-options');

			if (options) {
				options = $.extend(defaults, Mavo.options(options));
			} else {
				options = defaults;
			}

		},

		edit: function () {

			$.create('section', {
				style: {
					width: this.element.offsetWidth + 'px',
					height: '20px',
				},
				className: 'cropper-bar',
				contents: [{
						tag: 'button',
						type: 'button',
						textContent: 'Flip',
						events: {
							click: function () {
								this.cropper.scaleX(-1);
							}.bind(this)
						}
					},
					{
						tag: 'button',
						type: 'button',
						textContent: 'Save',
						events: {
							click: function () {
								this.element.src = this.cropper.getCroppedCanvas().toDataURL();
								// this.element.setAttribute('content', this.cropper.getCroppedCanvas().toDataURL());
								// this.element.style.content = this.cropper.getCroppedCanvas().toDataURL();
								// this.cropper.getCroppedCanvas().toBlob(blob => {
								// 	this.mavo.upload(blob);
								// });
								// this.cropper.getCroppedCanvas().toBlob(blob => {
								// 	this.upload(blob, 'image');
								// });
							}.bind(this)
						}
					},
					{
						tag: 'button',
						type: 'button',
						textContent: 'Edit',
						events: {
							click: function () {
								// Wrapper
								$.create('div', {
									style: {
										width: this.element.offsetWidth + 'px',
										height: this.element.offsetHeight + 'px'
									},
									around: this.element
								});

								// Preview
								$.create('div', {
									style: {
										width: this.element.offsetWidth / 2 + 'px',
										height: this.element.offsetHeight / 2 + 'px',
										overflow: 'hidden',
									},
									className: 'cropper-preview',
									after: this.element
								});

								// this.cropper = new Cropper(this.element, options);
								this.cropper = new Cropper(this.element, $.extend(options, { preview: $('.cropper-preview') }));
							}.bind(this)
						}
					}
				],
				before: this.element
			});



			// this.element.style.maxWidth = '100%';

			// this.cropper = new Cropper(this.element, options);
			// Mavo.setAttributeShy(this.element, 'mv-uploads', 'images');
			// return this.createUploadPopup('image/*', 'image', 'png');
		},

		// editor: function () {
		// 	// env.editor = this.createUploadPopup('image/*', 'image', 'png');
		// 	Mavo.setAttributeShy(this.element, 'mv-uploads', 'images');
		// 	// this.element.setAttribute('mv-uploads', 'images');
		// 	return this.createUploadPopup('image/*', 'image', 'png');

		// 	// env.editor = $.create("textarea");
		// 	// env.editor.style.whiteSpace = "pre-wrap";

		// 	// return env.editor;
		// },

		done: function () {
			if (this.cropper) {
				this.cropper.destroy();

				// Remove the wrapper
				$.before(this.element, this.element.parentElement);
				$.remove(this.element.nextElementSibling);
			}

			// Remove the section with buttons
			$('.cropper-bar').remove();
		}
	});
})(Bliss, Bliss.$);
