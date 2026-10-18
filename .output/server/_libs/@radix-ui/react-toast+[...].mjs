import { n as __toESM } from "../../_runtime.mjs";
import { l as require_react_dom, u as require_react } from "../@floating-ui/react-dom+[...].mjs";
import { n as createContextScope, o as useComposedRefs, s as require_jsx_runtime, t as createCollection } from "./react-collection+[...].mjs";
import { t as composeEventHandlers } from "../radix-ui__primitive.mjs";
import { b as Primitive, d as useControllableState, f as Presence, g as Branch, h as useLayoutEffect2, p as Portal, v as Root$1, x as dispatchDiscreteCustomEvent, y as useCallbackRef } from "./react-dialog+[...].mjs";
//#region node_modules/@radix-ui/react-visually-hidden/dist/index.mjs
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var __defProp$1 = Object.defineProperty;
var __name$1 = (target, value) => __defProp$1(target, "name", {
	value,
	configurable: true
});
var VISUALLY_HIDDEN_STYLES = Object.freeze({
	position: "absolute",
	border: 0,
	width: 1,
	height: 1,
	padding: 0,
	margin: -1,
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	wordWrap: "normal"
});
var VisuallyHidden = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name$1(function VisuallyHidden2(props, forwardedRef) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		...props,
		ref: forwardedRef,
		style: {
			...VISUALLY_HIDDEN_STYLES,
			...props.style
		}
	});
}, "VisuallyHidden"));
var Root = VisuallyHidden;
//#endregion
//#region node_modules/@radix-ui/react-toast/dist/index.mjs
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", {
	value,
	configurable: true
});
var PROVIDER_NAME = "ToastProvider";
var [Collection, useCollection, createCollectionScope] = createCollection("Toast");
var [createToastContext, createToastScope] = createContextScope("Toast", [createCollectionScope]);
var [ToastProviderProvider, useToastProviderContext] = createToastContext(PROVIDER_NAME);
var ToastProvider = /* @__PURE__ */ __name((props) => {
	const { __scopeToast, label = "Notification", duration = 5e3, swipeDirection = "right", swipeThreshold = 50, announcerContainer, children } = props;
	const [viewport, setViewport] = import_react.useState(null);
	const [toastCount, setToastCount] = import_react.useState(0);
	const isClosePausedRef = import_react.useRef(false);
	if (!label.trim()) console.error(`Invalid prop \`label\` supplied to \`${PROVIDER_NAME}\`. Expected non-empty \`string\`.`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Provider, {
		scope: __scopeToast,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastProviderProvider, {
			scope: __scopeToast,
			label,
			duration,
			swipeDirection,
			swipeThreshold,
			toastCount,
			viewport,
			onViewportChange: setViewport,
			onToastAdd: import_react.useCallback(() => setToastCount((prevCount) => prevCount + 1), []),
			onToastRemove: import_react.useCallback(() => setToastCount((prevCount) => prevCount - 1), []),
			isClosePausedRef,
			announcerContainer,
			children
		})
	});
}, "ToastProvider");
var VIEWPORT_NAME = "ToastViewport";
var VIEWPORT_DEFAULT_HOTKEY = ["F8"];
var VIEWPORT_PAUSE = "toast.viewportPause";
var VIEWPORT_RESUME = "toast.viewportResume";
var ToastViewport = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function ToastViewport2(props, forwardedRef) {
	const { __scopeToast, hotkey = VIEWPORT_DEFAULT_HOTKEY, label = "Notifications ({hotkey})", ...viewportProps } = props;
	const context = useToastProviderContext(VIEWPORT_NAME, __scopeToast);
	const getItems = useCollection(__scopeToast);
	const wrapperRef = import_react.useRef(null);
	const headFocusProxyRef = import_react.useRef(null);
	const tailFocusProxyRef = import_react.useRef(null);
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange);
	const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
	const hasToasts = context.toastCount > 0;
	import_react.useEffect(() => {
		const handleKeyDown = /* @__PURE__ */ __name((event) => {
			if (hotkey.length !== 0 && hotkey.every((key) => event[key] || event.code === key)) ref.current?.focus();
		}, "handleKeyDown");
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [hotkey]);
	import_react.useEffect(() => {
		const wrapper = wrapperRef.current;
		const viewport = ref.current;
		if (hasToasts && wrapper && viewport) {
			const handlePause = /* @__PURE__ */ __name(() => {
				if (!context.isClosePausedRef.current) {
					const pauseEvent = new CustomEvent(VIEWPORT_PAUSE);
					viewport.dispatchEvent(pauseEvent);
					context.isClosePausedRef.current = true;
				}
			}, "handlePause");
			const handleResume = /* @__PURE__ */ __name(() => {
				if (context.isClosePausedRef.current) {
					const resumeEvent = new CustomEvent(VIEWPORT_RESUME);
					viewport.dispatchEvent(resumeEvent);
					context.isClosePausedRef.current = false;
				}
			}, "handleResume");
			const handleFocusOutResume = /* @__PURE__ */ __name((event) => {
				if (!wrapper.contains(event.relatedTarget)) handleResume();
			}, "handleFocusOutResume");
			const handlePointerLeaveResume = /* @__PURE__ */ __name(() => {
				if (!wrapper.contains(document.activeElement)) handleResume();
			}, "handlePointerLeaveResume");
			wrapper.addEventListener("focusin", handlePause);
			wrapper.addEventListener("focusout", handleFocusOutResume);
			wrapper.addEventListener("pointermove", handlePause);
			wrapper.addEventListener("pointerleave", handlePointerLeaveResume);
			window.addEventListener("blur", handlePause);
			window.addEventListener("focus", handleResume);
			return () => {
				wrapper.removeEventListener("focusin", handlePause);
				wrapper.removeEventListener("focusout", handleFocusOutResume);
				wrapper.removeEventListener("pointermove", handlePause);
				wrapper.removeEventListener("pointerleave", handlePointerLeaveResume);
				window.removeEventListener("blur", handlePause);
				window.removeEventListener("focus", handleResume);
			};
		}
	}, [hasToasts, context.isClosePausedRef]);
	const getSortedTabbableCandidates = import_react.useCallback(({ tabbingDirection }) => {
		const tabbableCandidates = getItems().map((toastItem) => {
			const toastNode = toastItem.ref.current;
			const toastTabbableCandidates = [toastNode, ...getTabbableCandidates(toastNode)];
			return tabbingDirection === "forwards" ? toastTabbableCandidates : toastTabbableCandidates.reverse();
		});
		return (tabbingDirection === "forwards" ? tabbableCandidates.reverse() : tabbableCandidates).flat();
	}, [getItems]);
	import_react.useEffect(() => {
		const viewport = ref.current;
		if (viewport) {
			const handleKeyDown = /* @__PURE__ */ __name((event) => {
				const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
				if (event.key === "Tab" && !isMetaKey) {
					const focusedElement = document.activeElement;
					const isTabbingBackwards = event.shiftKey;
					if (event.target === viewport && isTabbingBackwards) {
						headFocusProxyRef.current?.focus();
						return;
					}
					const sortedCandidates = getSortedTabbableCandidates({ tabbingDirection: isTabbingBackwards ? "backwards" : "forwards" });
					const index = sortedCandidates.findIndex((candidate) => candidate === focusedElement);
					if (focusFirst(sortedCandidates.slice(index + 1))) event.preventDefault();
					else isTabbingBackwards ? headFocusProxyRef.current?.focus() : tailFocusProxyRef.current?.focus();
				}
			}, "handleKeyDown");
			viewport.addEventListener("keydown", handleKeyDown);
			return () => viewport.removeEventListener("keydown", handleKeyDown);
		}
	}, [getItems, getSortedTabbableCandidates]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Branch, {
		ref: wrapperRef,
		role: "region",
		"aria-label": label.replace("{hotkey}", hotkeyLabel),
		tabIndex: -1,
		style: { pointerEvents: hasToasts ? void 0 : "none" },
		children: [
			hasToasts && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusProxy, {
				ref: headFocusProxyRef,
				onFocusFromOutsideViewport: () => {
					focusFirst(getSortedTabbableCandidates({ tabbingDirection: "forwards" }));
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Slot, {
				scope: __scopeToast,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.ol, {
					tabIndex: -1,
					...viewportProps,
					ref: composedRefs
				})
			}),
			hasToasts && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusProxy, {
				ref: tailFocusProxyRef,
				onFocusFromOutsideViewport: () => {
					focusFirst(getSortedTabbableCandidates({ tabbingDirection: "backwards" }));
				}
			})
		]
	});
}, "ToastViewport"));
var FOCUS_PROXY_NAME = "ToastFocusProxy";
var FocusProxy = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function ToastFocusProxy(props, forwardedRef) {
	const { __scopeToast, onFocusFromOutsideViewport, ...proxyProps } = props;
	const context = useToastProviderContext(FOCUS_PROXY_NAME, __scopeToast);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisuallyHidden, {
		tabIndex: 0,
		...proxyProps,
		ref: forwardedRef,
		style: { position: "fixed" },
		onFocus: (event) => {
			const prevFocusedElement = event.relatedTarget;
			if (!context.viewport?.contains(prevFocusedElement)) onFocusFromOutsideViewport();
		}
	});
}, "ToastFocusProxy"));
var TOAST_NAME = "Toast";
var TOAST_SWIPE_START = "toast.swipeStart";
var TOAST_SWIPE_MOVE = "toast.swipeMove";
var TOAST_SWIPE_CANCEL = "toast.swipeCancel";
var TOAST_SWIPE_END = "toast.swipeEnd";
var Toast = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function Toast2(props, forwardedRef) {
	const { forceMount, open: openProp, defaultOpen, onOpenChange, ...toastProps } = props;
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? true,
		onChange: onOpenChange,
		caller: TOAST_NAME
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Presence, {
		present: forceMount || open,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastImpl, {
			open,
			...toastProps,
			ref: forwardedRef,
			onClose: () => setOpen(false),
			onPause: useCallbackRef(props.onPause),
			onResume: useCallbackRef(props.onResume),
			onSwipeStart: composeEventHandlers(props.onSwipeStart, (event) => {
				event.currentTarget.setAttribute("data-swipe", "start");
			}),
			onSwipeMove: composeEventHandlers(props.onSwipeMove, (event) => {
				const { x, y } = event.detail.delta;
				event.currentTarget.setAttribute("data-swipe", "move");
				event.currentTarget.style.setProperty("--radix-toast-swipe-move-x", `${x}px`);
				event.currentTarget.style.setProperty("--radix-toast-swipe-move-y", `${y}px`);
			}),
			onSwipeCancel: composeEventHandlers(props.onSwipeCancel, (event) => {
				event.currentTarget.setAttribute("data-swipe", "cancel");
				event.currentTarget.style.removeProperty("--radix-toast-swipe-move-x");
				event.currentTarget.style.removeProperty("--radix-toast-swipe-move-y");
				event.currentTarget.style.removeProperty("--radix-toast-swipe-end-x");
				event.currentTarget.style.removeProperty("--radix-toast-swipe-end-y");
			}),
			onSwipeEnd: composeEventHandlers(props.onSwipeEnd, (event) => {
				const { x, y } = event.detail.delta;
				event.currentTarget.setAttribute("data-swipe", "end");
				event.currentTarget.style.removeProperty("--radix-toast-swipe-move-x");
				event.currentTarget.style.removeProperty("--radix-toast-swipe-move-y");
				event.currentTarget.style.setProperty("--radix-toast-swipe-end-x", `${x}px`);
				event.currentTarget.style.setProperty("--radix-toast-swipe-end-y", `${y}px`);
				setOpen(false);
			})
		})
	});
}, "Toast"));
var [ToastInteractiveProvider, useToastInteractiveContext] = createToastContext(TOAST_NAME, { onClose() {} });
var ToastImpl = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function ToastImpl2(props, forwardedRef) {
	const { __scopeToast, type = "foreground", duration: durationProp, open, onClose, onEscapeKeyDown, onPause, onResume, onSwipeStart, onSwipeMove, onSwipeCancel, onSwipeEnd, ...toastProps } = props;
	const context = useToastProviderContext(TOAST_NAME, __scopeToast);
	const getItems = useCollection(__scopeToast);
	const [node, setNode] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, setNode);
	const pointerStartRef = import_react.useRef(null);
	const swipeDeltaRef = import_react.useRef(null);
	const duration = durationProp || context.duration;
	const closeTimerStartTimeRef = import_react.useRef(0);
	const closeTimerRemainingTimeRef = import_react.useRef(duration);
	const closeTimerRef = import_react.useRef(0);
	const { onToastAdd, onToastRemove } = context;
	const handleClose = useCallbackRef(() => {
		if (node?.contains(document.activeElement)) context.viewport?.focus();
		onClose();
	});
	const startTimer = import_react.useCallback((duration2) => {
		if (!duration2 || duration2 === Infinity) return;
		window.clearTimeout(closeTimerRef.current);
		closeTimerStartTimeRef.current = (/* @__PURE__ */ new Date()).getTime();
		closeTimerRef.current = window.setTimeout(handleClose, duration2);
	}, [handleClose]);
	import_react.useEffect(() => {
		const viewport = context.viewport;
		if (viewport) {
			const handleResume = /* @__PURE__ */ __name(() => {
				startTimer(closeTimerRemainingTimeRef.current);
				onResume?.();
			}, "handleResume");
			const handlePause = /* @__PURE__ */ __name(() => {
				const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef.current;
				closeTimerRemainingTimeRef.current = closeTimerRemainingTimeRef.current - elapsedTime;
				window.clearTimeout(closeTimerRef.current);
				onPause?.();
			}, "handlePause");
			viewport.addEventListener(VIEWPORT_PAUSE, handlePause);
			viewport.addEventListener(VIEWPORT_RESUME, handleResume);
			return () => {
				viewport.removeEventListener(VIEWPORT_PAUSE, handlePause);
				viewport.removeEventListener(VIEWPORT_RESUME, handleResume);
			};
		}
	}, [
		context.viewport,
		duration,
		onPause,
		onResume,
		startTimer
	]);
	import_react.useEffect(() => {
		if (open && !context.isClosePausedRef.current) startTimer(duration);
	}, [
		open,
		duration,
		context.isClosePausedRef,
		startTimer
	]);
	import_react.useEffect(() => {
		return () => {
			window.clearTimeout(closeTimerRef.current);
		};
	}, []);
	import_react.useEffect(() => {
		onToastAdd();
		return () => onToastRemove();
	}, [onToastAdd, onToastRemove]);
	const announceTextContent = import_react.useMemo(() => {
		return node ? getAnnounceTextContent(node) : null;
	}, [node]);
	if (!context.viewport) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [announceTextContent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastAnnounce, {
		__scopeToast,
		role: "status",
		"aria-live": type === "foreground" ? "assertive" : "polite",
		children: announceTextContent
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastInteractiveProvider, {
		scope: __scopeToast,
		onClose: handleClose,
		children: import_react_dom.createPortal(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.ItemSlot, {
			scope: __scopeToast,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$1, {
				asChild: true,
				onEscapeKeyDown: composeEventHandlers(onEscapeKeyDown, (event) => {
					if (!getItems().some((item) => item.ref.current?.contains(event.target))) handleClose();
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.li, {
					tabIndex: 0,
					"data-state": open ? "open" : "closed",
					"data-swipe-direction": context.swipeDirection,
					...toastProps,
					ref: composedRefs,
					style: {
						userSelect: "none",
						touchAction: "none",
						...props.style
					},
					onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
						if (event.key !== "Escape") return;
						onEscapeKeyDown?.(event.nativeEvent);
						if (!event.nativeEvent.defaultPrevented) handleClose();
					}),
					onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
						if (event.button !== 0) return;
						pointerStartRef.current = {
							x: event.clientX,
							y: event.clientY
						};
					}),
					onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
						if (!pointerStartRef.current) return;
						const x = event.clientX - pointerStartRef.current.x;
						const y = event.clientY - pointerStartRef.current.y;
						const hasSwipeMoveStarted = Boolean(swipeDeltaRef.current);
						const isHorizontalSwipe = ["left", "right"].includes(context.swipeDirection);
						const clamp = ["left", "up"].includes(context.swipeDirection) ? Math.min : Math.max;
						const clampedX = isHorizontalSwipe ? clamp(0, x) : 0;
						const clampedY = !isHorizontalSwipe ? clamp(0, y) : 0;
						const moveStartBuffer = event.pointerType === "touch" ? 10 : 2;
						const delta = {
							x: clampedX,
							y: clampedY
						};
						const eventDetail = {
							originalEvent: event,
							delta
						};
						if (hasSwipeMoveStarted) {
							swipeDeltaRef.current = delta;
							handleAndDispatchCustomEvent(TOAST_SWIPE_MOVE, onSwipeMove, eventDetail, { discrete: false });
						} else if (isDeltaInDirection(delta, context.swipeDirection, moveStartBuffer)) {
							swipeDeltaRef.current = delta;
							handleAndDispatchCustomEvent(TOAST_SWIPE_START, onSwipeStart, eventDetail, { discrete: false });
							event.target.setPointerCapture(event.pointerId);
						} else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer) pointerStartRef.current = null;
					}),
					onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
						const delta = swipeDeltaRef.current;
						const target = event.target;
						if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
						swipeDeltaRef.current = null;
						pointerStartRef.current = null;
						if (delta) {
							const toast = event.currentTarget;
							const eventDetail = {
								originalEvent: event,
								delta
							};
							if (isDeltaInDirection(delta, context.swipeDirection, context.swipeThreshold)) handleAndDispatchCustomEvent(TOAST_SWIPE_END, onSwipeEnd, eventDetail, { discrete: true });
							else handleAndDispatchCustomEvent(TOAST_SWIPE_CANCEL, onSwipeCancel, eventDetail, { discrete: true });
							toast.addEventListener("click", (event2) => event2.preventDefault(), { once: true });
						}
					})
				})
			})
		}), context.viewport)
	})] });
}, "ToastImpl"));
var ToastAnnounce = /* @__PURE__ */ __name((props) => {
	const { __scopeToast, children, ...announceProps } = props;
	const context = useToastProviderContext(TOAST_NAME, __scopeToast);
	const [renderAnnounceText, setRenderAnnounceText] = import_react.useState(false);
	const [isAnnounced, setIsAnnounced] = import_react.useState(false);
	useNextFrame(() => setRenderAnnounceText(true));
	import_react.useEffect(() => {
		const timer = window.setTimeout(() => setIsAnnounced(true), 1e3);
		return () => window.clearTimeout(timer);
	}, []);
	return isAnnounced ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, {
		asChild: true,
		container: context.announcerContainer || void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisuallyHidden, {
			...announceProps,
			children: renderAnnounceText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				context.label,
				" ",
				children
			] })
		})
	});
}, "ToastAnnounce");
var ToastTitle = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function ToastTitle2(props, forwardedRef) {
	const { __scopeToast, ...titleProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		...titleProps,
		ref: forwardedRef
	});
}, "ToastTitle"));
var ToastDescription = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function ToastDescription2(props, forwardedRef) {
	const { __scopeToast, ...descriptionProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		...descriptionProps,
		ref: forwardedRef
	});
}, "ToastDescription"));
var ACTION_NAME = "ToastAction";
var ToastAction = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function ToastAction2(props, forwardedRef) {
	const { altText, ...actionProps } = props;
	if (!altText.trim()) {
		console.error(`Invalid prop \`altText\` supplied to \`${ACTION_NAME}\`. Expected non-empty \`string\`.`);
		return null;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastAnnounceExclude, {
		altText,
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastClose, {
			...actionProps,
			ref: forwardedRef
		})
	});
}, "ToastAction"));
var CLOSE_NAME = "ToastClose";
var ToastClose = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function ToastClose2(props, forwardedRef) {
	const { __scopeToast, ...closeProps } = props;
	const interactiveContext = useToastInteractiveContext(CLOSE_NAME, __scopeToast);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToastAnnounceExclude, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
			type: "button",
			...closeProps,
			ref: forwardedRef,
			onClick: composeEventHandlers(props.onClick, interactiveContext.onClose)
		})
	});
}, "ToastClose"));
var ToastAnnounceExclude = /* @__PURE__ */ import_react.forwardRef(/* @__PURE__ */ __name(function ToastAnnounceExclude2(props, forwardedRef) {
	const { __scopeToast, altText, ...announceExcludeProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"data-radix-toast-announce-exclude": "",
		"data-radix-toast-announce-alt": altText || void 0,
		...announceExcludeProps,
		ref: forwardedRef
	});
}, "ToastAnnounceExclude"));
function getAnnounceTextContent(container) {
	const textContent = [];
	Array.from(container.childNodes).forEach((node) => {
		if (node.nodeType === node.TEXT_NODE && node.textContent) textContent.push(node.textContent);
		if (isHTMLElement(node)) {
			const isHidden = node.ariaHidden || node.hidden || node.style.display === "none";
			const isExcluded = node.dataset.radixToastAnnounceExclude === "";
			if (!isHidden) if (isExcluded) {
				const altText = node.dataset.radixToastAnnounceAlt;
				if (altText) textContent.push(altText);
			} else textContent.push(...getAnnounceTextContent(node));
		}
	});
	return textContent;
}
__name(getAnnounceTextContent, "getAnnounceTextContent");
function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
	const currentTarget = detail.originalEvent.currentTarget;
	const event = new CustomEvent(name, {
		bubbles: true,
		cancelable: true,
		detail
	});
	if (handler) currentTarget.addEventListener(name, handler, { once: true });
	if (discrete) dispatchDiscreteCustomEvent(currentTarget, event);
	else currentTarget.dispatchEvent(event);
}
__name(handleAndDispatchCustomEvent, "handleAndDispatchCustomEvent");
var isDeltaInDirection = /* @__PURE__ */ __name((delta, direction, threshold = 0) => {
	const deltaX = Math.abs(delta.x);
	const deltaY = Math.abs(delta.y);
	const isDeltaX = deltaX > deltaY;
	if (direction === "left" || direction === "right") return isDeltaX && deltaX > threshold;
	else return !isDeltaX && deltaY > threshold;
}, "isDeltaInDirection");
function useNextFrame(callback = () => {}) {
	const fn = useCallbackRef(callback);
	useLayoutEffect2(() => {
		let raf1 = 0;
		let raf2 = 0;
		raf1 = window.requestAnimationFrame(() => raf2 = window.requestAnimationFrame(fn));
		return () => {
			window.cancelAnimationFrame(raf1);
			window.cancelAnimationFrame(raf2);
		};
	}, [fn]);
}
__name(useNextFrame, "useNextFrame");
function isHTMLElement(node) {
	return node.nodeType === node.ELEMENT_NODE;
}
__name(isHTMLElement, "isHTMLElement");
function getTabbableCandidates(container) {
	const nodes = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: /* @__PURE__ */ __name((node) => {
		const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
		if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
		return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	}, "acceptNode") });
	while (walker.nextNode()) nodes.push(walker.currentNode);
	return nodes;
}
__name(getTabbableCandidates, "getTabbableCandidates");
function focusFirst(candidates) {
	const previouslyFocusedElement = document.activeElement;
	return candidates.some((candidate) => {
		if (candidate === previouslyFocusedElement) return true;
		candidate.focus();
		return document.activeElement !== previouslyFocusedElement;
	});
}
__name(focusFirst, "focusFirst");
var Provider = ToastProvider;
var Viewport = ToastViewport;
var Root2 = Toast;
var Title = ToastTitle;
var Description = ToastDescription;
var Action = ToastAction;
var Close = ToastClose;
//#endregion
export { Root2 as a, Root as c, Provider as i, Close as n, Title as o, Description as r, Viewport as s, Action as t };
