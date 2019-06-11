(function ($, $$) {
	const SELECTOR = '.cropper, [mv-cropper-options]';

	let defaults = {
		viewMode: 3,
		autoCropArea: 1
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
			let fileName;
			Mavo.setAttributeShy(this.element, 'mv-uploads', 'images');
			// Generate the default editor
			const popup = this.createUploadPopup('image/*', 'image', 'png');
			// Do I have to unbind to change the event handler, or there is another way?
			// What about other events?
			$.unbind($('input[type=file]', popup), 'change');
			$('input[type=file]', popup).addEventListener('change', evt => {
				const file = evt.target.files[0];

				if (file) {
					fileName = file.name;
					const tempURL = URL.createObjectURL(file);
					this.element.setAttribute(this.attribute, tempURL);
					if (this.cropper) {
						this.cropper.replace(tempURL);
					}
				}
			});
			// and extend it with appropriate elements
			$.create('div', {
				// Wrap the image element with a block element (container)
				className: 'cropper-wrapper',
				style: {
					maxWidth: this.element.offsetWidth + 'px'
				},
				contents: [{
					tag: 'img',
					src: this.element.src,
					className: 'cropper-preview',
					// Limit image width to avoid overflow the container
					style: {
						maxWidth: '100%'
					}
				}],
				inside: popup
			});
			// TODO: Generate the cropper-bar depending on the Cropper options: this.cropper.options
			$.create('div', {
				className: 'cropper-bar',
				contents: {
					tag: 'button',
					type: 'button',
					textContent: 'Done',
					events: {
						click: function () {
							this.cropper.getCroppedCanvas().toBlob(file => {
								this.upload(file, fileName);
							});
						}.bind(this)
					}
				},
				inside: popup
			});
			this.cropper = new Cropper($('.cropper-preview', popup), options);
			return popup;
		},

		// done: function () {
		// 	if (this.cropper) {
		// 		this.cropper.destroy();
		// 	}
		// }
	});
})(Bliss, Bliss.$);
