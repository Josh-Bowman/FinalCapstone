/**
 * List handler for reservation resources
 */

 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
 const service = require("./reservations.service");
 
 async function list(req, res) {
	 const date  = req.query.date;
	 const {mobile_number} = req.query;
	 if (mobile_number) {
		 const searchResults = await service.phoneLookup(mobile_number);
		 return res.json({data: searchResults});
	 } else {
		 const data = await service.list(date);
		 res.json({
			 data,
		 });
	 }
 }
 
 function isReservationValid(req, res, next) {
	 const newReservation = req.body.data;
	 const requiredFields = [
		 "first_name",
		 "last_name",
		 "mobile_number",
		 "reservation_date",
		 "reservation_time",
		 "people",
	 ];
 
	 if (!newReservation) {
		 return next({
			 status: 400,
			 message: "Couldn't find data. Make sure you have a data key in your request body.",
		 });
	 } else {
		 for (let field of requiredFields) {
			 if (!req.body.data[field]) {
				 return next({
					 status: 400,
					 message: `${field} is required`,
				 })
			 }
		 }
	 }
 
	 next();
 }
 
 function isPeopleCountValid(req, res, next) {
	 const newReservation = req.body.data;
	 const people = newReservation.people;
	 if (typeof people !== "number" || people < 1) {
		 return next({
			 status: 400,
			 message: "people is not valid",
		 });
	 }
	 next();
 }
 
 function isTimeAndDateValid(req, res, next) {
	 const newReservation = req.body.data;
	 const timeStamp = Date.parse(newReservation.reservation_date);
	 const timeFormat = /\d\d:\d\d/;
	 const time = newReservation.reservation_time;
	 const date = new Date(`${newReservation.reservation_date}T${newReservation.reservation_time}:00`);
	 const todayDate = new Date();
	 const hours = date.getHours();
	 const minutes = date.getMinutes();
	 const dateFormat = /\d\d\d\d-\d\d-\d\d/;
	 const dateIsValid = newReservation.reservation_date.match(dateFormat)?.length > 0;
 
	 if (isNaN(timeStamp)) {
		 return next({
			 status: 400,
			 message: "reservation_date is not a valid date",
		 });
	 }
 
	 if (!time.match(timeFormat)) {
		 return next({
			 status: 400,
			 message: "reservation_time is not a valid time",
		 });
	 }
 
	 if (dateIsValid && date.getDay() === 2) {
		 return next({
			 status: 400,
			 message: "The restaurant is closed on Tuesdays",
		 });
	 }
 
	 if (date < todayDate) {
		 return next({
			 status: 400,
			 message: "A date from the future is required",
		 });
	 }
 
	 if (hours < 10 || (hours === 10 && minutes < 30)) {
		 return next({
			 status: 400,
			 message: "The restaurant opens at 10:30am",
		 });
	 }
 
	 if ((hours === 21 && minutes > 30) || (hours === 22 && minutes < 30)) {
		 return next({
			 status: 400,
			 message: "Any time after 9:30 PM is too late. Closing soon.",
		 });
	 }
 
	 if (hours > 22 || (hours === 22 && minutes >= 30)) {
		 return next({
			 status: 400,
			 message: "Restaurant closes at 10:30 PM.",
		 });
	 }
	 next();
 }
 
 function isSeatStatusValid(req, res, next) {
	 const newReservation = req.body.data;
	 if (newReservation.status === "seated" || newReservation.status === "finished") {
		 return next({
			 status: 400,
			 message: `Status can't be '${newReservation.status}'.  Must be 'booked' `,
		 });
	 }
	 next();
 }
 
 async function reservationExists(req, res, next) {
	 const {reservation_id} = req.params;
	 const foundReservation = await service.read(Number(reservation_id));
 
	 if (!foundReservation) {
		 return next({
			 status: 404,
			 message: `Reservation for id ${reservation_id} not found.`,
		 });
	 }
	 res.locals.reservation = foundReservation;
	 next();
 }
 
 async function isStatusValid(req, res, next) {
	 const {status} = req.body.data;
	 const validOptions = ["booked", "seated", "finished", "cancelled"];
	 if (!validOptions.includes(status)) {
		 return next({
			 status: 400,
			 message: `Status: ${status} is unknown.`,
		 });
	 }
 
	 if (res.locals.reservation.status === "finished") {
		 return next({
			 status: 400,
			 message: `Reservation is finished and can't be updated.`,
		 });
	 }
	 next();
 }
 
 async function create(req, res) {
	 const newReservation = req.body.data;
	 const data = await service.create(newReservation);
	 res.status(201).json({data});
 }
 
 async function read(req, res) {
	 const data = res.locals.reservation;
	 res.json({data});
 }
 
 async function updateReservationStatus(req, res) {
	 const {reservation_id} = req.params;
	 const {status} = req.body.data;
	 const data = await service.updateReservationAfterTableReset(Number(reservation_id), status);
	 res.json({data});
 }
 
 async function update(req, res, next) {
	 const updateData = req.body.data;
	 const {reservation_id} = req.params;
	 const data = await service.update(Number(reservation_id), updateData);
	 res.json({data});
 }
 
 module.exports = {
	 list: [asyncErrorBoundary(list)],
	 create: [isReservationValid, isTimeAndDateValid, isPeopleCountValid, isSeatStatusValid, asyncErrorBoundary(create)],
	 read: [asyncErrorBoundary(reservationExists), read],
	 updateReservationStatus: [
		 asyncErrorBoundary(reservationExists),
		 isStatusValid,
		 asyncErrorBoundary(updateReservationStatus),
	 ],
	 update: [
		 asyncErrorBoundary(reservationExists),
		 isReservationValid,
		 isTimeAndDateValid,
		 isPeopleCountValid,
		 isSeatStatusValid,
		 asyncErrorBoundary(update),
	 ],
 };