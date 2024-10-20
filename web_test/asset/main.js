'use strict';

let lib = {};
window.lib = lib;
export function load(name, callback = null) {
	import('/asset/lib_'+name+'.js?modify=2024.10.xxxx').then(module => {
		lib = lib || {};
		lib[name] = module;
		module.set_lib(lib);
		module.main();
		if (callback != null) callback();
	});
}
lib['load'] = load;
lib.load('user', function () {
	lib.load('toastr');
	lib.load('table');
	lib.load('control');
});