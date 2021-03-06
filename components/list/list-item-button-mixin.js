import '../colors/colors.js';
import { css, html } from 'lit-element/lit-element.js';
import { ListItemMixin } from './list-item-mixin.js';

export const ListItemButtonMixin = superclass => class extends ListItemMixin(superclass) {

	static get styles() {

		const styles = [ css`
			:host {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
			}
			:host d2l-list-item-generic-layout.d2l-focusing,
			:host d2l-list-item-generic-layout.d2l-hovering {
				background-color: var(--d2l-color-regolith);
			}
			button {
				background-color: transparent;
				border: none;
				cursor: pointer;
				display: block;
				height: 100%;
				outline: none;
				width: 100%;
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	_onButtonClick() {
		this.dispatchEvent(new CustomEvent('d2l-list-item-button-click', { bubbles: true }));
	}

	_renderPrimaryAction(labelledBy) {
		return html`<button aria-labelledby="${labelledBy}" @click="${this._onButtonClick}"></button>`;
	}

};
