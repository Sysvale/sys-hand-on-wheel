import { ref, readonly, shallowRef, h, render, type Ref, getCurrentInstance, defineComponent, resolveComponent } from 'vue';

interface DialogOptions {
	title: string;
	description: string;
	variant: string;
	okButtonText: string;
	cancelButtonText: string;
	actionButtonVariant: string;
	onOk: () => void;
	onCancel: () => void;
}

export function useDialog() {
	const instance = getCurrentInstance();
	const appContext = instance?.appContext;

	const isVisible: Ref<boolean> = ref(false);

	const defaultOptions: DialogOptions = {
		title: 'Confirmação de exclusão',
		description: 'Deseja realmente apagar este registro? Essa ação é irreversível.',
		variant: 'warning',
		okButtonText: 'Sim, apagar',
		cancelButtonText: 'Cancelar',
		actionButtonVariant: 'red',
		onOk: () => {},
		onCancel: () => {},
	};

	const options: Ref<DialogOptions> = ref({ ...defaultOptions });

	const container = shallowRef<HTMLElement | null>(null);

	const createContainer = (): void => {
		if (!container.value) {
			container.value = document.createElement('div');
			document.body.appendChild(container.value);
		}
	};

	const destroyContainer = (): void => {
		if (container.value) {
			render(null, container.value);
			document.body.removeChild(container.value);
			container.value = null;
		}
	};

	const confirm = (): void => {
		options.value.onOk?.();
		hide();
	};

	const cancel = (): void => {
		options.value.onCancel?.();
		hide();
	};

	const show = (opts: Partial<DialogOptions>): void => {
		options.value = { ...defaultOptions, ...opts };
		createContainer();
		renderDialog();
		isVisible.value = true;
	};

	const hide = (): void => {
		isVisible.value = false;
		destroyContainer();
	};

	const renderDialog = (): void => {
		if (!container.value) return;

		const dialog = defineComponent({
			setup() {
			return () =>
				h(resolveComponent('CdsDialogModal'), {
					modelValue: isVisible.value,
					'update:modelValue': (value: boolean) => {
						isVisible.value = value;
						if (!value) cancel();
					},
					variant: options.value.variant,
					title: options.value.title,
					description: options.value.description,
					okButtonText: options.value.okButtonText,
					cancelButtonText: options.value.cancelButtonText,
					actionButtonVariant: options.value.actionButtonVariant,
					onOk: confirm,
					onCancel: cancel,
				});
			},
		});

		const vnode = h(dialog);

		if (appContext) {
			vnode.appContext = appContext;
		}

		render(vnode, container.value);
	};

	return {
		show,
		hide,
		confirm,
		cancel,
		isVisible: readonly(isVisible),
		options: readonly(options),
	};
}
