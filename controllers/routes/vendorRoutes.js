const jwt = require('jsonwebtoken');

module.exports = (imports) => {
	let { bcrypt, jwt, key, app, mat, vendor, receipt, urlencodedParser, transporter } = imports;

	app.get('/ABH_Invoice_Form', (req, res) => {
		const { tok, vend } = req.query;
		if (tok !== undefined && vend !== undefined) {
			vendor
				.findOne({ VendorName: vend })
				.then((vdoc) => {
					console.log('query was made');
					if (vdoc === null) {
						console.log('vdoc is null');
						res.render('404Page');
					} else {
						//search db to see if token exists
						let keyIndex = vdoc.key.findIndex((key) => {
							return key === tok;
						});
						//if found ...validate token to see if we need to remove it from db

						console.log(keyIndex);
						if (keyIndex !== -1) {
							jwt.verify(tok, key.jwtSecret, (err) => {
								if (err) {
									vdoc.key.splice(keyIndex, 1);

									vendor.findByIdAndUpdate(vdoc._id, { key: vdoc.key }).then(() => {
										console.log('token no longer valid so it was removed');
									});
									res.render('404Page');
								} else {
									let token = jwt.decode(tok);
									res.render('vendor/vendorFill', { qs: token, tok: tok, vendorName: vend });
								}
							});
						} else {
							//if not found ...
							console.log('token not found');
							res.render('404Page');
						}
					}
				})
				.catch((err) => console.log(err));
		} else {
			res.render('404Page');
		}
	});

	app.post('/ABH_Invoice_Form', urlencodedParser, (req, res) => {
		// console.log(req.body);

		const {
			vendorName,
			category,
			material,
			abhRequest,
			itemCode,
			ammount,
			measurement,
			priceIn,
			priceType,
			inStock,
			dateInStock,
			payType,
			payTerms,
			shippingDate,
			shipCompName,
			shipAddress1,
			shipAddress2,
			shipCity,
			shipState,
			shipZip,
			shipCountry,
			notes,
			newMaterial,
			tok
		} = req.body;
		console.log(req.body);
		var DateInStock = dateInStock;
		var InStock = inStock;
		var isNew = '';
		const query = { VendorName: vendorName };
		const update = {
			PayType: payType,
			PayTerms: payTerms,
			shipCompName: shipCompName,
			shipAddress1: shipAddress1,
			shipAddress2: shipAddress2,
			shipCity: shipCity,
			shipState: shipState,
			shipZip: shipZip,
			shipCountry: shipCountry
		};
		console.log();
		if (InStock == 'on') {
			InStock = 'Yes';
			DateInStock = Date();
		} else {
			InStock = 'No';
		}
		//check if token and vendor value's still are there
		if (tok !== undefined && vendorName !== undefined) {
			vendor
				.findOne({ VendorName: vendorName })
				.then((vdoc) => {
					console.log('query was made');
					console.log(vendorName);
					//check if the vendors name has been tampered with
					if (vdoc === null) {
						console.log('vdoc is null');
						res.render('404Page');
					} else {
						//search db to see if token exists
						let keyIndex = vdoc.key.findIndex((key) => {
							return key === tok;
						});
						//if found ...validate token to see if we need to remove it from db

						console.log(keyIndex);
						if (keyIndex !== -1) {
							console.log('key found');
							jwt.verify(tok, key.jwtSecret, (err) => {
								if (err) {
									console.log('validation error in vendor form POST');
									res.render('404Page');
								} else {
									vdoc.key.splice(keyIndex, 1);
									vendor
										.findByIdAndUpdate(vdoc._id, { key: vdoc.key })
										.then(() => {
											console.log('submition was sent removing token');
										})
										.catch((err) => {
											console.log('issue with removal of token');
											console.log(err);
										});
									let vProfile = vdoc;
									vProfile.PayType = payType;
									vProfile.PayTerms = payTerms;
									vProfile.shipCompName = shipCompName;
									vProfile.shipAddress1 = shipAddress1;
									vProfile.shipAddress2 = shipAddress2;
									vProfile.shipCity = shipCity;
									vProfile.shipState = shipState;
									vProfile.shipZip = shipZip;
									vProfile.shipCountry = shipCountry;

									if (newMaterial === 'true') {
										let catIndex = vProfile.Categories.findIndex((doc) => {
											return doc.CategoryName === category;
										});
										let matIndex = vProfile.Categories[catIndex].Material.findIndex((mat) => {
											return mat === material;
										});

										//updating material database if it is a new material aka mass request so many vendors
										mat.findOne({ Category: category }).then((doc) => {
											let matDoc = doc.Material;
											let matIndex = matDoc.findIndex((mat) => {
												return mat.MaterialName === material;
											});

											matDoc.Material[matIndex].Vendors.push(vendorName);
											mat
												.findOneAndUpdate({ Category: category }, { Material: matDoc })
												.then((res) => {
													console.log('Material Update Complete');
												})
												.catch((err) => {
													console.log(err);
												}); ///// This is where we left off
										});

										if (catIndex !== -1) {
											if (matIndex !== -1) {
												vProfile.Categories[catIndex].Materials.push(material);
											}
										} else {
											let newCat = {
												CategoryName: category,
												Material: [ material ]
											};
											vProfile.Material.push(newMat);
										}
										//TODO:		updating vendor material BETA this is just here as a reference  TODO:
										// vendor.findOne({ VendorName: vendorName }).then((doc) => {
										// 	let cat = doc.Categories;
										// 	let catIndex = cat.findIndex((cat) => {
										// 		return cat.CategoryName === category;
										// 	});
										// 	cat[catIndex].Materials.push(material);
										// 	vendor
										// 	.findOneAndUpdate({ VendorName: vendorName }, { Categories: cat })
										// 	.then('Updated Vendor')
										// 	.catch((err) => {
										// 		console.log(err);
										// 	});
										// });

										let vUpdate = {
											PayType: vProfile.PayType,
											PayTerms: vProfile.PayTerms,
											shipCompName: vProfile.shipCompName,
											shipAddress1: vProfile.shipAddress1,
											shipAddress2: vProfile.shipAddress2,
											shipCity: vProfile.shipCity,
											shipState: vProfile.shipState,
											shipZip: vProfile.shipZip,
											shipCountry: vProfile.shipCountry,
											Categories: vProfile.Categories
										};

										vendor
											.findOneAndUpdate({ VendorName: vendorName }, vUpdate)
											.then((doc) => {
												console.log('update successfull');
											})
											.catch((err) => {
												console.log(err);
											});
									} else {
										let vUpdate = {
											PayType: vProfile.PayType,
											PayTerms: vProfile.PayTerms,
											shipCompName: vProfile.shipCompName,
											shipAddress1: vProfile.shipAddress1,
											shipAddress2: vProfile.shipAddress2,
											shipCity: vProfile.shipCity,
											shipState: vProfile.shipState,
											shipZip: vProfile.shipZip,
											shipCountry: vProfile.shipCountry
										};

										vendor
											.findOneAndUpdate({ VendorName: vendorName }, vUpdate)
											.then((doc) => {
												console.log('update successfull');
											})
											.catch((err) => {
												console.log(err);
											});
									}

									const mailOptionsVendForm = {
										from: `${vendorName} <${vProfile.Email}>`, // sender address Purchasing@abhnature.com
										to: '<tech@abhpharma.com>',
										// cc: '<tech@abhpharma.com>', // list of receivers
										subject: `${vendorName} Request Submission For ${material}`,
										text: `
													NEW MATERIAL: ${isNew} <br>
													Response from vendor: ${vendorName}<br><br>
													Material: ${material}<br>
													ABH Requested: ${abhRequest}<br><br>
													Item Code: ${itemCode} <br>
													Min Order Quantity: ${ammount}  ${measurement}<br>
													Price: ${priceIn} USD  ---- ${priceType}<br>
													In Stock : ${InStock}<br>
													Date In Stock: ${DateInStock}<br><br><br><br>


													Payment Type: ${payType}<br>
													Payment Terms: ${payTerms}<br>
													Shipping Date ${shippingDate}<br><br><br>


													Shipping Company : <br>
													${shipCompName}<br>
													${shipAddress1}<br>
													${shipAddress2}<br>
													${shipCity}<br>
													${shipState}<br>
													${shipZip}<br>

													Notes left by ${vendorName} : <br> ${notes}.



													<br><br>
													The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
													Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729
													`,
										html: `
													NEW MATERIAL: ${isNew} <br>
													Response from vendor: ${vendorName}<br><br>
													Material: ${material}<br>
													ABH Requested: ${abhRequest}<br><br>
													Item Code: ${itemCode} <br>
													Min Order Quantity: ${ammount}  ${measurement}<br>
													Price: ${priceIn} USD  ---- ${priceType}<br>
													In Stock : ${InStock}<br>
													Date In Stock: ${DateInStock}<br><br><br><br>


													Payment Type: ${payType}<br>
													Payment Terms: ${payTerms}<br>
													Shipping Date ${shippingDate}<br><br><br>




													Shipping Company : <br>
													${shipCompName}<br>
													${shipAddress1}<br>
													${shipAddress2}<br>
													${shipCity}<br>
													${shipState}<br>
													${shipZip}<br>

													Notes left by ${vendorName} : <br> ${notes}.



													<br><br>
													The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
													Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729
													`
									};

									//this has the receipt functionallty
									receipt.find({}).then((receiptDoc) => {
										let rDoc = receiptDoc;
										let rIndex = rDoc.findIndex((rec) => {
											return rec.VendorName === vendorName;
										});
										if (rIndex === -1) {
											var createReceipt = receipt({
												VendorName: vendorName,

												Receipt: [
													{
														Category: category,
														Material: material,
														ABH_Request: abhRequest,
														Item_Code: itemCode,
														Ammount: ammount + ' ' + measurement,
														Price: priceIn,
														Price_Type: priceType,
														In_Stock: inStock,
														Date_In_Stock: dateInStock,
														PayType: payType,
														PayTerms: payTerms,
														ShippingDate: shippingDate,
														Shipping_Company_Name: shipCompName,
														Ship_Address1: shipAddress1,
														Ship_Address2: shipAddress2,
														Ship_City: shipCity,
														Ship_State: shipState,
														Ship_Zip: shipZip,
														Ship_Country: shipCountry,
														Notes: notes
													}
												]
											});

											createReceipt.save((err) => {
												if (err) {
													console.log(err);
												} else {
													console.log('Submission Recieved And Stored');
												}
											});
										} else {
											let newReceipt = {
												Category: category,
												Material: material,
												ABH_Request: abhRequest,
												Item_Code: itemCode,
												Ammount: ammount + ' ' + measurement,
												Price: priceIn,
												Price_Type: priceType,
												In_Stock: inStock,
												Date_In_Stock: dateInStock,
												PayType: payType,
												PayTerms: payTerms,
												ShippingDate: shippingDate,
												Shipping_Company_Name: shipCompName,
												Ship_Address1: shipAddress1,
												Ship_Address2: shipAddress2,
												Ship_City: shipCity,
												Ship_State: shipState,
												Ship_Zip: shipZip,
												Ship_Country: shipCountry,
												Notes: notes
											};

											console.log(rDoc[rIndex]);
											rDoc[rIndex].Receipt.push(newReceipt);
											receipt
												.findOneAndUpdate(
													{ VendorName: vendorName },
													{ Receipt: rDoc[rIndex].Receipt }
												)
												.then((doc) => {
													console.log('vendor exists so added rec to db');
												})
												.catch((err) => {
													console.log(err);
												});
										}
									});

									transporter.send(mailOptionsVendForm, function(err, info) {
										if (err) console.log('Couldnt send email' + err);
										else {
											// console.log(info);
											console.log('Email Sent');
											res.redirect('https://abhpharma.com/');
										}
									});
								}
							});
						} else {
							//if not found ...
							console.log('token not found');
							res.render('404Page');
						}
					}
				})
				.catch((err) => console.log(err));
		} else {
			res.render('404Page');
		}
	});

	app.get('/Do_Not_Supply', urlencodedParser, (req, res) => {
		const { tok, vend } = req.query;

		console.log('recieved request to remove');

	

		if (tok !== undefined && vend !== undefined) {
			vendor
				.findOne({ VendorName: vend })
				.then((vdoc) => {
					console.log('query was made');
					if (vdoc === null) {
						console.log('vdoc is null');
						res.render('404Page');
					} else {
						//search db to see if token exists
						let keyIndex = vdoc.key.findIndex((key) => {
							return key === tok;
						});
						//if found ...validate token to see if we need to remove it from db

						console.log(keyIndex);
						if (keyIndex !== -1) {
							jwt.verify(tok, key.jwtSecret, (err) => {
								if (err) {
									res.render('404Page');
								} else {
									let token = jwt.decode(tok);
									let {newMaterial,category,material,vendorName} = token
									console.log(newMaterial)
									if (newMaterial === false) {
										mat.findOne({ Category: category }).then((matDoc) => {
											let vProfile = vdoc;
											let vCatI = vProfile.Categories.findIndex((doc) => {
												return doc.CategoryName === category;
											});
											let vMatI = vProfile.Categories[vCatI].Materials.findIndex((mat) => {
												return mat === material;
											});
											console.log(vMatI);

											let mProfile = matDoc;
											let mMatI = mProfile.Material.findIndex((mat) => {
												return mat.MaterialName === material;
											});
											let mVendI = mProfile.Material[mMatI].Vendors.findIndex((vend) => {
												return vend === vendorName;
											});

											vProfile.Categories[vCatI].Materials.splice(vMatI, 1);
											mProfile.Material[mMatI].Vendors.splice(mVendI, 1);

											// console.log(vProfile.Categories[vCatI].Materials);
											// console.log(mProfile.Material[mMatI].Vendors);

											if (mProfile.Material[mMatI].Vendors[0] === undefined) {
												console.log('is empty');
												mProfile.Material.splice(mMatI, 1);

												const mailOptionsVendUnsubscibeNewDel = {
													from: `${vendorName} <${vProfile.Email}>`, // sender address
													to: ' <tech@abhpharma.com>,<Purchasing@abhnature.com>', // list of receivers
													subject: `${vendorName} Unsubscription For ${material} ---MATERIAL REMOVED---`,
													text: `Since ${vendorName} requested to be removed from the email chain for material: ${material} in category ${category}, we dont have any vendors that support it so it was removed from the database. <br><br> If the vendor contacts you to undo this change you can always re-add the material in the <em>Modify Material<em> Page in the purchase app. All you will have to do is: <br> 1) search for the vendors name<br>2)Select the category that the material belongs in<br> 3)Add the material ** Spaces should be replaced with dashes and multiple materials should be comma seperated AND no spaces before or after the commas <br> 4)Then click save


												<br><br>
												The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
												Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729

												`,
													html: `Since ${vendorName} requested to be removed from the email chain for material: ${material} in category ${category}, we dont have any vendors that support it so it was removed from the database. <br><br> If the vendor contacts you to undo this change you can always re-add the material in the <em>Modify Material<em> Page in the purchase app. All you will have to do is: <br> 1) search for the vendors name<br>2)Select the category that the material belongs in<br> 3)Add the material ** Spaces should be replaced with dashes and multiple materials should be comma seperated AND no spaces before or after the commas <br> 4)Then click save


												<br><br>
												The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
												Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729

												`
												};
												transporter.send(mailOptionsVendUnsubscibeNewDel, function(err, info) {
													if (err) console.log('Couldnt send email' + err);
													else null;
													// console.log(info);
													res.render('vendor/materialRemoved');
												});
											} else {
												const mailOptionsVendUnsubscibeNew = {
													from: `${vendorName} <${vdoc.Email}>`, // sender address
													to: '<Purchasing@abhnature.com>',
													cc: '<tech@abhpharma.com>', // list of receivers
													subject: `${vendorName} Unsubscription For ${material}`,
													text: `Since ${vendorName} requested to be removed from the email chain for material: ${material} in category ${category}. <br><br> If the vendor contacts you to undo this change you can always re-add the material in the <em>Modify Vendor<em> Page in the purchase app. All you will have to do is: <br> 1) search for the vendors name<br>2)Select the category that the material belongs in<br> 3)Add the material ** Spaces should be replaced with dashes and multiple materials should be comma seperated AND no spaces before or after the commas <br> 4)Then click save




											<br><br>
											The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
											Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729
											`,
													html: `Since ${vendorName} requested to be removed from the email chain for material: ${material} in category ${category}. <br><br> If the vendor contacts you to undo this change you can always re-add the material in the <em>Modify Vendor<em> Page in the purchase app. All you will have to do is: <br> 1) search for the vendors name<br>2)Select the category that the material belongs in<br> 3)Add the material ** Spaces should be replaced with dashes and multiple materials should be comma seperated AND no spaces before or after the commas <br> 4)Then click save




											<br><br>
											The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
											Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729
											`
												};
												transporter.send(mailOptionsVendUnsubscibeNew, function(err, info) {
													if (err) console.log('Couldnt send email' + err);
													else null;
													// console.log(info);
													res.render('vendor/materialRemoved');
												});
											}

											mat
												.findOneAndUpdate({ Category: category }, { Material: mProfile.Material })
												.then((doc) => {
													console.log('Updated Database');
												})
												.catch((err) => {
													console.log(err);
												});
											vendor
												.findOneAndUpdate(
													{ VendorName: vendorName },
													{ Categories: vProfile.Categories }
												)
												.then((doc) => {
													console.log('Updated Database');
												})
												.catch((err) => {
													console.log(err);
												});
										});
									} else {
										res.render('vendor/materialRemoved');

										console.log('else');
										const mailOptionsUnsubscribe = {
											from: `${vendorName} <${vdoc.Email}>`, // sender address
											to: '<Purchasing@abhnature.com>',
											cc: '<tech@abhpharma.com>', // list of receivers
											subject: `${vendorName} Request Removal From Email Chain For New Material: ${material}`,
											text: `Since ${vendorName} requested to be removed from the email chain for material: ${material} in category ${category}, we dont have any vendors that support it so it was removed from the database. <br><br> If the vendor contacts you to undo this change you can always re-add the material in the <em>Modify Vendor<em> Page in the purchase app. All you will have to do is: <br> 1) search for the vendors name<br>2)Add the material ** Spaces should be replaced with dashes and multiple materials should be comma seperated AND no spaces befor or after the commas <br> 3)Then click save



													<br><br>
													The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
													Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729

													`,
											html: `Since ${vendorName} requested to be removed from the email chain for material: ${material} in category ${category}, we dont have any vendors that support it so it was removed from the database. <br><br> If the vendor contacts you to undo this change you can always re-add the material in the <em>Modify Vendor<em> Page in the purchase app. All you will have to do is: <br> 1) search for the vendors name<br>2)Add the material ** Spaces should be replaced with dashes and multiple materials should be comma seperated AND no spaces befor or after the commas <br> 3)Then click save



													<br><br>
													The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
													Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729

													`
										};
										transporter.send(mailOptionsUnsubscribe, function(err, info) {
											if (err) console.log('Couldnt send email' + err);
											else null;
											// console.log(info);
											res.render('vendor/materialRemoved');
										});
									}
								}
							});
						} else {
							//if not found ...
							console.log('token not found');
							res.render('404Page');
						}
					}
				})
				.catch((err) => console.log(err));
		} else {
			res.render('404Page');
		}





	});
	app.post('/Do_Not_Supply', urlencodedParser, (req, res) => {
		res.render('404Page');
	});
};