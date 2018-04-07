// 判断元素是否已经有了该类名
export function hasClass(el, className) {
	let reg = new RegExp('(^|\\S)' + className + '(\\s|$)');
	return reg.test(el.className);
}

	// 给元素添加类名
export function addClass(el, className) {
	if(hasClass(el, className)) {
		return;
	}

	let newClass = el.className.split(' ');
	newClass.push(className);
	el.className = newClass.join(' ');
}