exports.views = {

	all : {

		map : function(doc) {
			if (doc.type && doc.type === 'contact') {

				emit([ doc.name ], {
					id : doc._id,
					name : doc.name,
					phones : doc.phones,
					emails : doc.emails,
				});
			}

		},
	// reduce: function(doc, req) {
	//			
	// }

	},
	birthdays : {
		map : function(doc) {
			if (doc.type && doc.type === 'contact') {
				if (doc.birthday) {
					emit([ doc.birthday ], {
						id : doc._id,
						name : doc.name,
						birthday : doc.birthday,
					});
				}
			}
		}
	},
	phoneLabels : {
		map : function(doc) {
			if (doc.type && doc.type === 'contact') {
				if (doc.phones) {
					for ( var i = 0; i < doc.phones.length; i++) {
						emit(doc.phones[i].label, 1);
					}
				}
			}
		},
		reduce : function(keys, values, rereduce) {
			if(sum === undefined) {
				// Android...
				var sum = 0;
				for(var i = 0; i < values.length; i++) {
					sum += values[i];
				}
				return sum;
			}
			return sum(values);
		}
	}
};

exports.lists = {
	html : function(head, req) {
		provides("html", function() {
			var list = [];

			while (row = getRow()) {
				list.push(row.value);
			}

			var handlebars = require('handlebars');
			return handlebars.templates['list.html']({
				contacts : list
			}, {});
		});
	}
}

exports.shows = {
	detail : function(doc, req) {
		var handlebars = require('handlebars');
		if (doc) {

			// handlebars.templates contains any templates loaded from the
			// template
			// directory in your
			// kanso.json, if you're not using the build-steps then this will
			// not exist.
			var html = handlebars.templates['contact_detail.html']({
				doc : doc
			}, {});
			return html;
		} else {
			// no doc-id supplied
		}
	}
};
