const Event = require('../models/event');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all events.
exports.event_list = function(req, res, next) {
    Event.find((err, events) => {  
        // Note that this error doesn't mean nothing was found,
        // it means the database had an error while searching, hence the 500 status
        if (err) return res.status(500).send(err)
        // send the list of all people
        return res.status(200).send(events);
    });
    
};

// Display detail page for a specific event.
exports.event_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Event detail: ' + req.params.id);
};

exports.event_date_post = function(req, res){
   Event.find({
	'startTime': {
		"$gte": req.body.startDate,
		"$lt": req.body.endDate
	}
   }, (err, events) => {
	console.log(events);
	if(err) return res.status(500).send(err)
	return res.status(200).send(events);
   }
);

};


// Display event create form on GET.
//exports.event_create_get = function(req, res) {
//    res.send('NOT IMPLEMENTED: Event create GET');
//};

// Handle event create on POST.
exports.event_create_post = function(req, res) {
    
   const eventObject = new Event({
   	startTime: req.body.startTime,
	endTime: req.body.endTime,
	description: req.body.description,
	category: req.body.category
   })

   eventObject.save(err => {  
        if (err) return res.status(500).send(err);
        return res.status(200).send(eventObject);
    });
};

// Display event delete form on GET.
exports.event_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Event delete GET');
};

// Handle event delete on POST.

exports.event_delete_post = function (req, res) {
    Event.findByIdAndRemove(req.params.id, (err, event) => {
        if (err) return res.status(500).send(err);
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        const response = {
            message: "Event successfully deleted",
            id: event._id
        };
        return res.status(200).send(response);
    });
};

// Display event update form on GET.
exports.event_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Event update GET');
};

// Handle event update on POST.
exports.event_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Event update POST');
};
