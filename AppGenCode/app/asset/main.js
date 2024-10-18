/* main.js */
'use strict';

let lib = {};
window.lib = lib;
export function load(name, callback = null) {
	import('/asset/lib_'+name+'.js?modify=2024.10.16.23h').then(module => {
		lib = lib || {};
		lib[name] = module;
		module.set_lib(lib);
		module.main();
		if (callback != null) callback();
	});
}
lib['load'] = load;
load('user', function () {
	load('toastr');
	load('table');
	load('control');
	load('sensor');
});

