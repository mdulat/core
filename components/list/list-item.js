import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { checkboxStyles } from '../inputs/input-checkbox-styles.js';
import { classMap} from 'lit-html/directives/class-map.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import ResizeObserver from 'resize-observer-polyfill';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const ro = new ResizeObserver(entries => {
	entries.forEach(entry => {
		if (!entry || !entry.target || !entry.target.resizedCallback) {
			return;
		}
		entry.target.resizedCallback(entry.contentRect && entry.contentRect.width);
	});
});

const defaultBreakpoints = [842, 636, 580, 0];

/**
 * A component for a "listitem" child within a list. It provides semantics, basic layout, breakpoints for responsiveness, a link for navigation, and selection.
 * @slot - Default content placed inside of the component
 * @slot illustration - Image associated with the list item located at the left of the item
 * @slot actions - Actions (e.g., button icons) associated with the listen item located at the right of the item
 * @fires d2l-list-item-selected - Dispatched when the component item is selected
 */
class ListItem extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Breakpoints for responsiveness in pixels. There are four different breakpoints and only the four largest breakpoints will be used.
			 */
			breakpoints: { type: Array },
			/**
			 * Disables the checkbox
			 */
			disabled: {type: Boolean },
			/**
			 * Address of item link if navigable
			 */
			href: { type: String },
			/**
			 * Value to identify item if selectable
			 */
			key: { type: String, reflect: true },
			/**
			 * @ignore
			 */
			role: { type: String, reflect: true },
			/**
			 * Indicates a checkbox should be rendered for selecting the item
			 */
			selectable: {type: Boolean },
			/**
			 * Whether the item is selected
			 */
			selected: { type: Boolean, reflect: true },
			_breakpoint: { type: Number }
		};
	}

	static get styles() {

		return [ checkboxStyles,  css`

			:host {
				display: block;
				margin-top: -1px;
			}

			:host[hidden] {
				display: none;
			}

			.d2l-list-item-flex {
				display: flex;
				position: relative;
			}

			.d2l-list-item-content {
				border-bottom: 1px solid transparent;
				border-bottom: 1px solid var(--d2l-color-mica);
				border-top: 1px solid var(--d2l-color-mica);
				width: 100%;
			}

			:host(:first-child) .d2l-list-item-content[data-separators="between"] {
				border-top: 1px solid transparent;
			}

			:host(:last-child) .d2l-list-item-content[data-separators="between"] {
				border-bottom: 1px solid transparent;
			}

			.d2l-list-item-content[data-separators="none"] {
				border-top: 1px solid transparent;
				border-bottom: 1px solid transparent;
			}

			.d2l-list-item-content-flex {
				display: flex;
				justify-content: stretch;
				padding: 0.55rem 0;
			}

			.d2l-list-item-content.d2l-list-item-content-extend-separators .d2l-list-item-content-flex {
				padding-left: 0.9rem;
				padding-right: 0.9rem;
			}

			input[type="checkbox"].d2l-input-checkbox {
				flex-grow: 0;
				flex-shrink: 0;
				margin: 0.6rem 0.9rem 0.6rem 0;
			}

			:host([dir="rtl"]) input[type="checkbox"].d2l-input-checkbox {
				margin-left: 0.9rem;
				margin-right: 0;
			}

			.d2l-list-item-container ::slotted([slot="illustration"]),
			.d2l-list-item-content-flex ::slotted([slot="illustration"]) {
				flex-grow: 0;
				flex-shrink: 0;
				margin: 0.15rem 0.9rem 0.15rem 0;
				max-height: 2.6rem;
				max-width: 4.5rem;
				border-radius: 6px;
				overflow: hidden;
			}

			:host([dir="rtl"]) .d2l-list-item-container ::slotted([slot="illustration"]),
			:host([dir="rtl"]) .d2l-list-item-content-flex ::slotted([slot="illustration"]) {
				margin-left: 0.9rem;
				margin-right: 0;
			}

			.d2l-list-item-main {
				flex-grow: 1;
				margin-top: 0.05rem;
			}

			.d2l-list-item-content-flex ::slotted([slot="actions"]) {
				align-self: flex-start;
				display: grid;
				flex-grow: 0;
				grid-auto-columns: 1fr;
				grid-auto-flow: column;
				grid-gap: 0.3rem;
				margin: 0.15rem 0;
				z-index: 4;
			}

			a, label {
				height: 100%;
				position: absolute;
				width: 100%;
				z-index: 2;
			}

			:host([href]) label {
				width: 2.1rem;
				z-index: 3;
			}

			:host([href]) {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
			}

			a[href]:focus + .d2l-list-item-content,
			a[href]:hover + .d2l-list-item-content {
				--d2l-list-item-content-text-decoration: underline;
			}

			:host([href]) .d2l-list-item-link:focus {
				outline: none;
			}

			.d2l-list-item-container[data-breakpoint="1"] ::slotted([slot="illustration"]),
			.d2l-list-item-container[data-breakpoint="1"] .d2l-list-item-content-flex ::slotted([slot="illustration"]) {
				margin-right: 1rem;
				max-height: 3.55rem;
				max-width: 6rem;
			}

			:host([dir="rtl"]) .d2l-list-item-container[data-breakpoint="1"] ::slotted([slot="illustration"]),
			:host([dir="rtl"]) .d2l-list-item-container[data-breakpoint="1"] .d2l-list-item-content-flex ::slotted([slot="illustration"]) {
				margin-left: 1rem;
				margin-right: 0;
			}

			.d2l-list-item-container[data-breakpoint="2"] ::slotted([slot="illustration"]),
			.d2l-list-item-container[data-breakpoint="2"] .d2l-list-item-content-flex ::slotted([slot="illustration"]) {
				margin-right: 1rem;
				max-height: 5.1rem;
				max-width: 9rem;
			}

			:host([dir="rtl"]) .d2l-list-item-container[data-breakpoint="2"] ::slotted([slot="illustration"]),
			:host([dir="rtl"]) .d2l-list-item-container[data-breakpoint="2"] .d2l-list-item-content-flex ::slotted([slot="illustration"]) {
				margin-left: 1rem;
				margin-right: 0;
			}

			.d2l-list-item-container[data-breakpoint="3"] ::slotted([slot="illustration"]),
			.d2l-list-item-container[data-breakpoint="3"] .d2l-list-item-content-flex ::slotted([slot="illustration"]) {
				margin-right: 1rem;
				max-height: 6rem;
				max-width: 10.8rem;
			}

			:host([dir="rtl"]) .d2l-list-item-container[data-breakpoint="3"] ::slotted([slot="illustration"]),
			:host([dir="rtl"]) .d2l-list-item-container[data-breakpoint="3"] .d2l-list-item-content-flex ::slotted([slot="illustration"]) {
				margin-left: 1rem;
				margin-right: 0;
			}

		`];
	}

	constructor() {
		super();
		this._breakpoint = 0;
		this.breakpoints = defaultBreakpoints;
		this.disabled = false;
		this.role = 'listitem';
		this.selected = false;
		this.selectable = false;
		this._contentId = getUniqueId();
		this._checkBoxId = getUniqueId();
	}

	get breakpoints() {
		return this._breakpoints;
	}

	set breakpoints(value) {
		const oldValue = this._breakpoints;
		if (value !== defaultBreakpoints) this._breakpoints = value.sort((a, b) => b - a).slice(0, 4);
		else this._breakpoints = defaultBreakpoints;
		this.requestUpdate('breakpoints', oldValue);
	}

	connectedCallback() {
		super.connectedCallback();

		const parent = findComposedAncestor(this.parentNode, (node) => {
			if (!node || node.nodeType !== 1) return false;
			return node.tagName === 'D2L-LIST';
		});
		if (parent !== null) {
			const separators = parent.getAttribute('separators');
			if (separators) this._separators = separators;
			this._extendSeparators = parent.hasAttribute('extend-separators');
		}

		ro.observe(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		ro.unobserve(this);
	}

	render() {

		const label = this.selectable ? html`<label class="d2l-list-item-label" for="${this._checkBoxId}" aria-labelledby="${this._contentId}"></label>` : null;
		const link = this.href ? html`<a class="d2l-list-item-link" href="${ifDefined(this.href)}" aria-labelledby="${this._contentId}"></a>` : null;
		const beforeContent = this.selectable
			? html`<input id="${this._checkBoxId}" class="d2l-input-checkbox" @change="${this._handleCheckboxChange}" type="checkbox" .checked="${this.selected}" ?disabled="${this.disabled}"><slot name="illustration"></slot>`
			: html`<slot name="illustration"></slot>`;

		const classes = {
			'd2l-list-item-container': true,
			'd2l-list-item-flex': label || link,
			'd2l-visible-on-ancestor-target': true
		};
		const contentClasses = {
			'd2l-list-item-content': true,
			'd2l-list-item-content-extend-separators': this._extendSeparators
		};

		return html`
			<div class="${classMap(classes)}" data-breakpoint="${this._breakpoint}">
				${label}
				${link}
				<div id="${this._contentId}"
					class="${classMap(contentClasses)}"
					data-separators="${ifDefined(this._separators)}">
					<div class="d2l-list-item-content-flex">
						${beforeContent}
						<div class="d2l-list-item-main"><slot></slot></div>
						<slot name="actions"></slot>
					</div>
				</div>
			</div>
		`;

	}

	updated(changedProperties) {
		if (changedProperties.has('key')) {
			const oldValue = changedProperties.get('key');
			if (typeof oldValue !== 'undefined') {
				this.setSelected(undefined, true);
			}
		}
		if (changedProperties.has('breakpoints')) {
			this.resizedCallback(this.offsetWidth);
		}
	}

	focus() {
		const node = getFirstFocusableDescendant(this);
		if (node) node.focus();
	}

	resizedCallback(width) {
		const lastBreakpointIndexToCheck = 3;
		this.breakpoints.some((breakpoint, index) => {
			if (width >= breakpoint || index > lastBreakpointIndexToCheck) {
				this._breakpoint = lastBreakpointIndexToCheck - index - (lastBreakpointIndexToCheck - this.breakpoints.length + 1) * index;
				return true;
			}
		});
	}

	setSelected(selected, suppressEvent) {
		this.selected = selected;
		if (!suppressEvent) this._dispatchSelected(selected);
	}

	_dispatchSelected(value) {
		this.dispatchEvent(new CustomEvent('d2l-list-item-selected', {
			detail: { key: this.key, selected: value },
			bubbles: true
		}));
	}

	_handleCheckboxChange(e) {
		this.setSelected(e.target.checked);
	}

}

customElements.define('d2l-list-item', ListItem);
