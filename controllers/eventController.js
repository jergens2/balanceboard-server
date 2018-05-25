var Event = require('../models/event');

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

// Display event create form on GET.
exports.event_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Event create GET');
};

// Handle event create on POST.
exports.event_create_post = function(req, res) {
    
    const eventObject = new Event({
        start: req.body.start,
        end: req.body.end,
        description: req.body.description
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
exports.event_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Event delete POST');
};

// Display event update form on GET.
exports.event_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Event update GET');
};

// Handle event update on POST.
exports.event_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Event update POST');
};