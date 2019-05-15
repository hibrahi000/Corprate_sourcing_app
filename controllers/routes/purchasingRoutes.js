module.exports = (imports) => {

	const{key,jwt,bcrypt,app,passport,purchEnsureAuthenticated,mat,vendor,urlencodedParser,transporter,connectABHPharmaDB,disconnectABHPharmaDB} = imports;
	let   {purchase}                                                                                                                             = imports;


    ///////////////////////////////ABH PURCHASE SITE LOGIN PAGE//////////
	app.get('/ABH_Purchase/Login', urlencodedParser, (req, res) => {
		res.render('purchLogin');
	});

	app.post('/Purchase_login', urlencodedParser, (req, res, next) => {
		// console.log('recieved post req');
		connectABHPharmaDB();
		passport.authenticate('purchPass', {
			successRedirect: '/ABH_Purchase/Dashboard',
			failureRedirect: '/ABH_Purchase/Login',
			failureFlash   : true
		})(req, res, next);
	});

	///////////////////////////////ABH PURCHASE SITE/////////////////////

	app.get('/ABH_Purchase/Dashboard', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		mat.find({}).then((matDoc) => {
			var categories = new Array();
			for (let i = 0; i < matDoc.length; i++) {
				categories.push(matDoc[i]);
			}
			// console.log(materials);
			purchase = 'reqQuote';
			res.render('purchDashboard', { purchase, categories });
		});
	});

	app.post('/Category_Request', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		const { masCat, category } = req.body;
		console.log(req.body);
		mat.findOne({ Category: category }).then((matDoc) => {
			let matList = new Array();
			for (let i = 0; i < matDoc.Material.length; i++) {
				matList.push(matDoc.Material[i]);
				// console.log(matDoc.Material[i].MaterialName);
			}
			// console.log(matList)
			// console.log(matList[0].MaterialName)
			// console.log(matList.length);
			purchase = 'materialSelect';
			res.render('purchDashboard', { purchase, matList, masCat, category });
		});
	});

	app.post('/Material_Request', urlencodedParser, purchEnsureAuthenticated, (req, res, next) => {
		const { category, newMat, masCat } = req.body;

		let { material } = req.body;
		    material     = material.toUpperCase();

		let newMaterial = 'No';
		if (newMat === 'on') {
			newMaterial = 'Yes';
		}
		// let dbQuery = 'noSearch';

		//allow user to add new materials but check for the following:

		// 1) if new material is checked skip the vendor search and go straight to creating a new material

		console.log('masCat:  ' + masCat === 'on');
		console.log('The material Inputed Was ' + material);

		vendor.find({}).then((vendorDoc) => {
			// console.log(vendorDoc)
			let vendList   = vendorDoc;
			let vEmailList = new Array();
			let vendorList = new Array();
			if (masCat === 'on') {
				mat
					.findOne({ Category: category })
					.then((doc) => {
						for (let i = 0; i < vendList.length; i++) {
							let catArray = vendList[i].Categories;
							for (let k = 0; k < catArray.length; k++) {
								if (catArray[k].CategoryName === category) {
									vEmailList.push(vendList[i].Email);
								}
							}
						}
						let dbMatArray         = doc.Material;
						let indexMaterialFound = dbMatArray.findIndex(mat => {
							return mat.MaterialName === material;
						});

						console.log(dbMatArray);
						console.log(indexMaterialFound);
						console.log(vEmailList);
						if(indexMaterialFound === -1){
							req.flash(
								'error_msg',
								'This Material is Not in the database for this category. If this is a new material uncheck the "Send to all category" and check "This is a new material" '
							);
							res.redirect('/ABH_Purchase/Dashboard');
						}
						else{
						purchase = 'submitReq';
						res.render('purchDashboard', { purchase, material, newMaterial, vEmailList, category });
						}
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				if (newMat == 'on') {
					mat
						.findOne({ Category: category })
						.then((doc) => {
							let matArr   = doc.Material;
							let matFound = matArr.findIndex((mat) => {
								return mat.MaterialName === material;
							});

							console.log(matFound);

							if (matFound === -1) {
								for (let i = 0; i < vendList.length; i++) {
									if (!vendorList.includes(vendList[i].VendorName)) {
										vendorList.push(vendList[i].VendorName);
										vEmailList.push(vendList[i].Email);
									}
								}
								console.log(vEmailList.length);
								purchase = 'submitReq';
								res.render('purchDashboard', { purchase, material, newMaterial, vEmailList, category });
							} else {
								req.flash(
									'error_msg',
									'This Material is already in the database so we cannot create a new one please uncheck New Material then proceed with your request'
								);
								res.redirect('/ABH_Purchase/Dashboard');
							}
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					mat
						.findOne({ Category: category })
						.then((doc) => {
							console.log(doc);
							console.log('starting test on db search');
							let matArr   = doc.Material;
							let matIndex = matArr.findIndex((arr) => {
								return arr.MaterialName === material;
							});
							console.log('matIndex= ' + matIndex + ' ' + matIndex === -1);
							if (matIndex === -1) {
								console.log('now entering');
								req.flash(
									'error_msg',
									'We cannot find the material You searched for if you would like to send a request for a new material check New Material to Yes.   WARNING: this action will send a request to all of the vendors in the database'
								);
								purchase = 'reqQuote';
								res.redirect('/ABH_Purchase/Dashboard');
							} else {
								for (let m = 0; m < matArr[matIndex].Vendors.length; m++) {
									vendorList.push(matArr[matIndex].Vendors[m]);
								}
								for (let i = 0; i < vendorList.length; i++) {
									let vIndex = vendList.findIndex((doc) => {
										return doc.VendorName === vendorList[i];
									});
									vEmailList.push(vendList[vIndex].Email);
								}
								console.log(vEmailList);
								dbQuery  = 'search';
								purchase = 'submitReq';
								res.render('purchDashboard', {
									purchase,
									material,
									newMaterial,
									dbQuery,
									category,
									vEmailList
								});
							}
						})
						.catch();
				}
			}
		});
	});

	app.get('/Purchase_Request', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		res.redirect('/ABH_Purchase/Dashboard');
	});

	app.post('/Purchase_Request', urlencodedParser, purchEnsureAuthenticated, (req, res, next) => {
		const { material, reqType, ammount, units, price, rushOrder, notes, newMat, category } = req.body;
		let { vEmailList } = req.body;
		vEmailList = vEmailList.split(',');
		let newMaterial = newMat === 'on';
		let noErr = true;
		const testing = false; // this is for simple testing
		let httpRoute = testing ?'http://localHost:5000/':'http://app.abhpharma.com/';




		if (newMaterial) {
			mat.findOne({ Category: category }).then((mDoc) => {
				let matArr = mDoc.Material;
				matArr.push({
					MaterialName: material,
					Vendors: []
				});

				console.log(matArr);

				mat
					.findOneAndUpdate({ Category: category }, { Material: matArr })
					.then(() => {
						console.log('Updated ' + category);
					})
					.catch((err) => {
						console.log(err);
					});
			});
		}

		console.log(vEmailList);
		console.log('------------------');

		vendor.find({}).then((vDoc) => {
			let vendArr = vDoc;

			for (let i = 0; i < vEmailList.length; i++) {
				let vIndex = vendArr.findIndex((doc) => {
					return doc.Email === vEmailList[i];
				});

                let vend = vendArr[vIndex];
				let vendId = vend._id;


				var orderType = rushOrder;
				if ((orderType = 'on')) {
					orderType = 'Rush Order';
				} else {
					orderType = 'Order';
				}

				var targetPrice = price;
				if (targetPrice != '') {
					targetPrice = `Our target price would preferably be ${price} $(USD)`;
				}

				var token = jwt.sign(
					{
					vendorName : vend.VendorName,
					shipCompName : vend.shipCompName,
					shipAddress1 : vend.shipAddress1,
					shipAddress2 : vend.ShipAdress2,
					shipCity : vend.shipCity,
					shipState : vend.shipState,
					shipZip : vend.shipZip,
					shipCountry : vend.shipCountry,
					newMaterial : newMaterial,
					rushOrder: rushOrder,
					targetPrice: targetPrice,
					material: material,
					category:category,
					orderType: orderType,
					abhRequest: `${orderType} Of ${ammount} ${units}: ${reqType}`,


					},
					key.jwtSecret,
					{
					expiresIn: "7 days"

					}
				);
				console.log(token);
				let vendorKeys = [...vend.key, token];


				 vendor.findByIdAndUpdate(vendId, {key : vendorKeys}).then(() => console.log('Updated tokens for  Vendor ' + vend.VendorName)).catch(err => {err ? err : 'no err'});


				var vendorName = vend.VendorName;
				//  console.log(vend.VendorName);
				// var shipCompName = vend.shipCompName;
				//  console.log(shipCompName);
				// var shipAddress1 = vend.shipAddress1;
				// const shipAddress2 = vend.ShipAdress2;
				// const shipCity = vend.shipCity;
				// const shipState = vend.shipState;
				// const shipZip = vend.shipZip;
				// const shipCountry = vend.shipCountry;
				// const matNew = newMaterial;


				const mailOptionsReq = {
					from: 'ABH Purchase Dept. <Purchasing@abhnature.com>', // sender address
					to: vEmailList[i], // list of receivers
					//${vendorContact[i]},
					subject: `ABH-Nature Quote Request for ${material} `, // Subject line
					text: `
								Hello ${vendorName}, <br>
								<br><br>

								We at ABH have requested a quote for the following material: ${material}
								<br><br>

								${targetPrice}<br>
								Notes: ${notes}<br><br>


								Attached to this email is a link that will allow you to send us your quote. This link will expire in 5 Days or once you submit the form.


								<br><br><br><br><br><br>

								We at ABH Appreciate your business with us and hope to hear from you soon.

								<br><br>
								The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
								Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729

								<br><br>
								http://app.abhpharma.com/ABH_Invoice_Form/?vend=${vendorName}&tok=${token}


								<br><br>

								If you do not supply this material and want to be removed from the email chain please click the following link <br>
								http://app.abhpharma.com/Do_Not_Supply/?vend=${vendorName}&tok=${token}

								`,
					html: `
								Hello ${vendorName}, <br>
								<br><br>

								We at ABH have requested a quote for the following material: ${material}
								<br><br>

								${targetPrice}<br>
								Notes: ${notes}<br><br>


								Attached to this email is a link that will allow you to send us your quote. This link will expire in 5 Days or once you submit the form.


								<br><br><br><br><br><br>

								We at ABH-Nature Appreciate your business with us and hope to hear from you soon.

								<br><br>
								The information contained in this communication is confidential, may be privileged and is intended for the exclusive use of the above named addressee(s). If you are not the intended recipient(s), you are expressly prohibited from copying, distributing, disseminating, or in any other way using any information contained within this communication. If you have received this communication in error please contact the sender by telephone or by response via mail. We have taken precautions to minimize the risk of transmitting software viruses, but we advise you to carry out your own virus checks on any attachment to this message. We cannot accept liability for any loss or damage caused by software virus. <br>
								Located At: 131 Heartland Boulevard, Edgewood, New York, U.S Phone:866-282-4729
								<br><br>

								<a href = "http://app.abhpharma.com/ABH_Invoice_Form/?vend=${vendorName}&tok=${token}">ABH Invoice Form<a>


								<br><br>

								If you do not supply this material and want to be removed from the email chain please click the following link <br>
								List-Unsubscribe: <mailto: emailAddress>, <unsubscribe URL > <a href = "http://app.abhpharma.com/Do_Not_Supply/?vend=${vendorName}&tok=${token}">Unsubscribe<a>
								`
				};
				//localHost:5000
				//app.abhpharma.com
				transporter
					.send(mailOptionsReq)
					.then((info) => {
						console.log('Sent Email to ' + vEmailList[i]);
					})
					.catch((err) => {
						console.log('there is a err sending to ' + vEmailList[i] + ' code err:', err);
						noErr = false;
					});
			}
		});
		if (noErr == true) {
			if (newMaterial) {
				req.flash('success_msg', `Request Has Been Sent TO ALL VENDORS`);
				res.redirect('/ABH_Purchase/Dashboard');
			} else {
				req.flash('success_msg', `Request Has Been Sent`);
				res.redirect('/ABH_Purchase/Dashboard');
			}
		} else {
			if (newMaterial) {
				req.flash(
					'error_msg',
					`ERROR REQUEST HAD PROBLEMS TO ALL VENDORS *** Please Contact Dev Department ***`
				);
				res.redirect('/ABH_Purchase/Dashboard');
			} else {
				req.flash('error_msg', `ERROR REQUEST HAD PROBLEMS  *** Please Contact Dev Department ***`);
				res.redirect('/ABH_Purchase/Dashboard');
			}
		}
	});

	///////////////////////////////////////////////////////////////////////////
	app.get('/ABH_Purchase/Modify_Vendor', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		vendor
			.find({})
			.then((vendor) => {
				// console.log(material[1].MaterialName);
				var vendorName = [];
				for (let i = 0; i < vendor.length; i++) {
					vendorName.push(vendor[i].VendorName);
				}

				purchase = 'modVend';
				res.render('purchDashboard', { purchase, vendorName });
			})
			.catch();
	});

	app.post('/Modify_Vendor', urlencodedParser, purchEnsureAuthenticated, (req, res, next) => {
		const vendSearch = req.body.vendSearch;
		purchase = 'vendInfoPull';
		vendor.findOne({ VendorName: vendSearch }).then((vendor) => {
			if (vendor === null) {
				req.flash(
					'error_msg',
					'It seems like you picked a vendor that isnt in the system please use the list of vendors in the search box'
				);
				res.redirect('/ABH_Purchase/Modify_Vendor');
			} else {
				const vendNam = vendor.VendorName;
				const repNam = vendor.RepName;
				const website = vendor.Website;

				const vendEmail = vendor.Email;
				const vendNum = vendor.Number;
				const shipCompNam = vendor.shipCompNam;
				const shipAddress1 = vendor.shipAddress1;
				const shipAddress2 = vendor.shipAddress2;
				const shipCity = vendor.shipCity;
				const shipState = vendor.shipState;
				const shipZip = vendor.shipZip;
				const shipCountry = vendor.shipCountry;
				//    console.log(matSup);

				res.render('purchDashboard', {
					purchase,
					vendNam,
					repNam,
					website,

					vendEmail,
					vendNum,
					shipCompNam,
					shipAddress1,
					shipAddress2,
					shipCity,
					shipState,
					shipZip,
					shipCountry
				});
			}
		});
	});

	app.post('/vendInfoModify', urlencodedParser, purchEnsureAuthenticated, (req, res, next) => {
		let {
			vendNam,
			repName,
			website,
			vendEmail,
			vendNum,
			shipCompNam,
			shipAddress1,
			shipAddress2,
			shipCity,
			shipState,
			shipZip,
			shipCountry
		} = req.body;

		console.log(req.body);
		// console.log(matSup);
		// console.log(vendNam);
		vendNam = vendNam.toUpperCase();
		repName = repName.toUpperCase();
		website = website.toUpperCase();
		// matSup = matSup.toUpperCase();
		vendEmail = vendEmail.toUpperCase();
		shipCompNam = shipCompNam.toUpperCase();
		shipAddress1 = shipAddress1.toUpperCase();
		shipAddress2 = shipAddress2.toUpperCase();
		shipCity = shipCity.toUpperCase();
		shipState = shipState.toUpperCase();

		shipCountry = shipCountry.toUpperCase();
		var matArray = new Array();

		// console.log(matArray);
		var query = { VendorName: vendNam }; // takes the readOnly value of vendNam from purchasePartial and then applies it the query

		var update = {
			VendorName: vendNam,
			RepName: repName,
			Website: website,
			// Material: matArray,
			Email: vendEmail,
			Number: vendNum,
			shipCompNam: shipCompNam,
			shipAddress1: shipAddress1,
			shipAddress2: shipAddress2,
			shipCity: shipCity,
			shipState: shipState,
			shipZip: shipZip,
			shipCountry: shipCountry
		};

		//this is to update the vendor doc
		vendor
			.findOneAndUpdate(query, update)
			.then((vendor) => {
				// this just updates the document of the vendor wheather it has or doesnt have the material in the list that is found not the material

				req.flash('success_msg', `You succesfully updated Vendor: ${vendNam}'s Info`);
				res.redirect('/ABH_Purchase/Modify_Vendor');
			})
			.catch((err) => {
				console.log(err);
			});
	});

	////////////////////////////////////////////////////////////////////////////
	app.get('/ABH_Purchase/Add_Vendor', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		mat.find({}).then((material) => {
			var materials = [];
			// console.log(material.length);
			for (let i = 0; i < material.length; i++) {
				materials.push(material[i].MaterialName);
			}

			purchase = 'addVend';
			// console.log(materials);
			res.render('purchDashboard', { purchase, materials });
		});
	});

	app.post('/Add_Vendor', urlencodedParser, purchEnsureAuthenticated, (req, res, next) => {
		let {
			vendNam,
			repName,
			website,

			vendEmail,
			vendNum,
			shipCompNam,
			shipAddress1,
			shipAddress2,
			shipCity,
			shipState,
			shipZip,
			shipCountry,
			notes
		} = req.body;
		vendNam = vendNam.toUpperCase();
		repName = repName.toUpperCase();
		website = website.toUpperCase();

		vendEmail = vendEmail.toUpperCase();
		shipCompNam = shipCompNam.toUpperCase();
		shipAddress1 = shipAddress1.toUpperCase();
		shipAddress2 = shipAddress2.toUpperCase();
		shipCity = shipCity.toUpperCase();
		shipState = shipState.toUpperCase();

		shipCountry = shipCountry.toUpperCase();

		// console.log(matArr);

		// console.log(matArray);

		vendor.findOne({ VendorName: vendNam }, function(err, data) {
			if (data === null) {
				console.log('begining addition to Vendor Collection');

				bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash('PharmaDebug!54', salt, (err, hash) => {
						if (err) throw err;
						let hashKey = {
                            HashKey: hash,
                            Material: "Debug Material",
                            EXP_Date: Date()
                        }
						var createVendor = new vendor({
							VendorName: vendNam,
							RepName: repName,
							Email: vendEmail,
							Number: vendNum,
							Website: website,
							Admin: false,

							shipCompName: shipCompNam,
							shipAddress1: shipAddress1,
							shipAddress2: shipAddress2,
							shipCity: shipCity,
							shipState: shipState,
							shipZip: shipZip,
							shipCountry: shipCountry,
							Notes: notes,
							key: hashKey
						});

						createVendor.save((err) => {
							if (err) {
								console.log(err);
							} else {
								console.log('Vendor Profile Saved');

								req.flash('success_msg', 'Vendor Profile Has Been Saved');
								res.redirect('/ABH_Purchase/Add_Vendor');
							}
						});
					})
				);
			} else {
				purchase = 'addVend';
				req.flash(
					'error_msg',
					'Vendor is already in the Database if you want to modify vendor go to Modify Vendor Info Page'
				);
				res.redirect('/ABH_Purchase/Add_Vendor');

				// console.log(data);
			}
		});
	});

	////////////////////////////////////////////////////////////////////////////TODO:
	app.get('/ABH_Purchase/Modify_Material', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		vendor.find({}).then((doc) => {
			let vendorName = new Array();
			for (let i = 0; i < doc.length; i++) {
				vendorName.push(doc[i].VendorName);
			}
			// console.log(vendorName);

			purchase = 'mat_Vend_Select';
			res.render('purchDashboard', { purchase, vendorName });
		});
	});

	app.post('/Vendor_Info_Pull', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		const { vendSearch, newCat } = req.body;
		if (newCat == 'on') {
			mat.find({}).then((doc) => {
				let catSearch = new Array();
				for (let i = 0; i < doc.length; i++) {
					catSearch.push(doc[i].Category);
				}
				// console.log(catSearch);
				purchase = 'add_Category_Vendor';
				res.render('purchDashboard', { purchase, vendSearch, catSearch });
			});
		} else {
			vendor.findOne({ VendorName: vendSearch }).then((doc) => {
				if (doc === null) {
					console.log('doc not Found');
					req.flash(
						'error_msg',
						' Looks like the vendor does not exists if this was not a typo go to the add vendor page'
					);
					res.redirect('/ABH_Purchase/Modify_Material');
				} else {
					let catSearch = new Array();
					// console.log(doc.Categories.length);
					for (let i = 0; i < doc.Categories.length; i++) {
						catSearch.push(doc.Categories[i].CategoryName);
					}
					// console.log(catSearch);
					purchase = 'mat_Cat_Select';
					res.render('purchDashboard', { purchase, vendSearch, catSearch });
				}
			});
		}
	});

	app.post('/Add_Category_Vendor', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		let { catAddition, vendSearch } = req.body;

		let catModel = {
			CategoryName: catAddition,
			Materials: []
		};

		vendor.findOne({ VendorName: vendSearch }).then((doc) => {
			// console.log(vendSearch);
			let arr = new Array();
			let isExist = doc.Categories.findIndex((Category) => {
				return Category.CategoryName === catAddition;
			});
			isExist = isExist !== -1;
			// console.log(isExist);
			if (!isExist) {
				vendor
					.findOneAndUpdate({ VendorName: vendSearch }, { $push: { Categories: catModel } })
					.then((doc) => {
						req.flash('success_msg', 'Category: ' + catAddition + ' was added to ' + vendSearch);
						res.redirect('/ABH_Purchase/Modify_Material');
						console.log('added category to vendor');
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				req.flash('error_msg', 'Category: ' + catAddition + ' already exists under the Vendor ' + vendSearch);
				res.redirect('/ABH_Purchase/Modify_Material');
			}
		});
	});

	app.post('/Vendor_Category_Pull', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		const { vendSearch, catSearch } = req.body;
		vendor.findOne({ VendorName: vendSearch }).then((doc) => {
			let catIndex = doc.Categories.findIndex((Categories) => {
				return Categories.CategoryName === catSearch;
			});

			if (catIndex === -1) {
				req.flash(
					'error_msg',
					'Please select the categories listed OR if you want to add a category to the vendor check the add category to vendor option'
				);
				res.redirect('/ABH_Purchase/Modify_Material');
			} else {
				let materialList = new Array();
				let dbMaterialArr = doc.Categories[catIndex].Materials;
				for (let i = 0; i < dbMaterialArr.length; i++) {
					materialList.push(dbMaterialArr[i]);
					// materialList.push('TestMaterial'+[i])
				}
				let materialListTemp = materialList;
				materialList = materialList.join(',\n');
				// console.log(materialList,vendSearch,catSearch)
				// console.log(materialList);
				purchase = 'mat_Vendor_Update';
				res.render('purchDashboard', { purchase, materialList, vendSearch, catSearch, materialListTemp });
			}
		});
	});

	app.post('/Update_Material_Push', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		const { vendSearch, catSearch } = req.body; // these reference the vendors name and category to search for to modify
		let { materialList, materialListTemp } = req.body; // this is the temporary list to compare to the new list to see what was added and what was removed

		let errors = new Array();

		function formatValidation(myArr) {
			let listValid = true;
			for (let i = 0; i < myArr.length; i++) {
				let test =
					myArr[i].indexOf(' ') === -1 &&
					myArr[i].indexOf('_') === -1 &&
					myArr[i].indexOf('+') === -1 &&
					myArr[i].indexOf(',') === -1 &&
					myArr[i].indexOf() === -1;

				if (test === false) {
					console.log(myArr[i] + ' is ' + 'INVALID FORMAT');
					listValid = false;
					break;
				}
			}
			return listValid;
		}

		// printout if it passed 2nd stage input verrification
		// console.log(materialList);
		// make both the temporary list and new list capitalized so that only the word is compared not the caseing
		materialList = materialList.toUpperCase();
		materialListTemp = materialListTemp.toUpperCase();

		//remove white space after the all the materials
		materialList = materialList.trim();

		let badComma = materialList.indexOf(',', materialList.length - 1) !== -1;
		console.log(badComma + ' bad comma');

		// use commas ',' to divide the lists and make a array
		if (materialList !== '') {
			materialList = materialList.split(',');
		}
		materialListTemp = materialListTemp.split(',');
		// console.log('this is now before validation ', materialList);
		//this is to prepare the list to be updated by replacing all the html tags that display the list in the textarea like tab(\r) and line brakes(\n) or both
		for (let i = 0; i < materialList.length; i++) {
			materialList[i] = materialList[i].replace(/(\r\n|\n|\r)/gm, '');
		}

		let formatPass = formatValidation(materialList); // this is to check to see if there are any : Spaces, extra commas,or underscore to sepereate multiword Materials
		// console.log(formatPass);

		//if the format that was entereed does not passes the second stage of checking then ...
		if (!formatPass || badComma) {
			errors.push({
				msg:
					'Please Seperate materials by a comma and then press enter for a new line, Make sure there are no commas at the last material, and use a "-" instead of a space'
			});
			purchase = 'mat_Vendor_Update';
			res.render('purchDashboard', {
				purchase,
				materialList,
				materialListTemp,
				vendSearch,
				catSearch,
				errors
			});
		} else {
			//if the format passes the first stage then enter ....
			let tMat = materialListTemp;
			// console.log(materialListTemp);
			//this is to check what the result is
			// console.log('this is now ', materialList);

			/////////////////////////////////DO NOT TOUCH THE FUNCTIONS BELOW THEY WORK AND LEAVE IT THAT WAY //////////////////////////////////////////

			// console.log('this is before ', tMat);

			// create materialPop and materialAdd arrays to use later to decied what to remove and what to add
			let materialPop = new Array();
			let materialAdd = new Array();
			//if something was added or removed then push it to either the material to pop array or material to add array ....
			if (tMat[0] === '' || tMat[0] === '') {
				for (let i = 0; i < materialList.length; i++) {
					if (tMat.includes(materialList[i]) == false) {
						materialAdd.push(materialList[i]);
					}
				}
			} else {
				for (let i = 0; i < tMat.length; i++) {
					if (materialList.includes(tMat[i]) == false) {
						materialPop.push(tMat[i]);
					}
				}
				for (let i = 0; i < materialList.length; i++) {
					if (tMat.includes(materialList[i]) == false) {
						materialAdd.push(materialList[i]);
					}
				}
			}

			// console.log(
			// (materialAdd[0] !== undefined && materialAdd[0] !== '') ||
			// (materialPop[0] !== undefined && materialPop[0] !== '')
			// );
			console.log('Material Was ADDED : ' + (materialAdd[0] !== undefined && materialAdd[0] !== ''));
			console.log('Material Was REMOVED : ' + (materialPop[0] !== undefined && materialPop[0] !== ''));
			//check if anything was added or removed if it was then proceed

			if (
				(materialAdd[0] !== undefined && materialAdd[0] !== '') ||
				(materialPop[0] !== undefined && materialPop[0] !== '')
			) {
				console.log('This is whats been added ' + materialAdd);
				console.log('This is whats been removed ' + materialPop);
				// console.log(materialPop[0] == undefined);
				// console.log(materialPop[0] == null);
				// console.log(materialPop[0] == '');

				//This section updated the vendor profile ::: TODO: DATE MODIFIED COMPLETION APRIL 15, 2019 TODO:
				vendor
					.findOne({ VendorName: vendSearch })
					.then((doc) => {
						let tempCat = new Array();
						for (let i = 0; i < doc.Categories.length; i++) {
							tempCat.push(doc.Categories[i]);
						}

						console.log(tempCat); // this is to log the category array as a reference

						// this returns the index of the category array that matches with the category we want to edit
						let index = tempCat.findIndex((Categories) => {
							return Categories.CategoryName === catSearch;
						});

						console.log(index); // this is to log the value of index to check if its right

						//This portion removes the removed values from the arr
						for (let i = 0; i < materialPop.length; i++) {
							let popI = tempCat[index].Materials.indexOf(materialPop[i]);

							tempCat[index].Materials.splice(popI, 1);
						}
						// console.log(tempCat);

						//This portion adds the added values from the arr
						for (let i = 0; i < materialAdd.length; i++) {
							let materialExist = false;
							let tDoc = doc.Categories;
							let catLength = tDoc.length;
							let categoryMatExist;
							// console.log(tDoc);
							for (let k = 0; k < catLength; k++) {
								let materialArr = tDoc[k].Materials;
								// console.log(materialArr);
								for (let j = 0; j < materialArr.length; j++) {
									if (materialArr[j] === materialAdd[i]) {
										materialExist = true;
										categoryMatExist = tDoc[k].CategoryName;
										errors.push({
											msg:
												'Material: ' +
												materialAdd[i] +
												' already exist in the ' +
												categoryMatExist
										});
										purchase = 'mat_Vendor_Update';
										res.render('purchDashboard', {
											purchase,
											materialList,
											materialListTemp,
											vendSearch,
											catSearch,
											errors
										});
										console.log('why are you adding another material to this');
										break;
									} else {
										console.log('Material Not found in other categories and is good for addition');
									}
								}
							}

							if (materialExist === false) {
								tempCat[index].Materials.push(materialAdd[i]);
							}
						}

						console.log(tempCat); // console log the resulting new category for upload

						vendor
							.findOneAndUpdate({ VendorName: vendSearch }, { Categories: tempCat })
							.then((doc) => {
								console.log('Updated the vendors Material profile');
								// req.flash('success_msg', 'Database Was Successfully Updated');
								// res.redirect('/ABH_Purchase/Modify_Material');
							})
							.catch((err) => {
								console.log(err);
							});
					})
					.then(() => {
						req.flash('success_msg', 'Database Successfully Updated');
						res.redirect('/ABH_Purchase/Modify_Material');
					})
					.catch((err) => {
						console.log(err);
					});
				/////////////////////////////////////////////////////////////////////////////////////////////////TODO: COMPLETED APRIL 18TH 2019

				//This section is to update the material document that houses the Categories => Materials => Vendors who supply the material
				// console.log(tMat[0] === '' || tMat[0] === undefined);
				mat
					.findOne({ Category: catSearch })
					.then((doc) => {
						// console.log(catSearch);
						// console.log(doc);
						if (materialAdd[0] !== undefined && materialAdd[0] !== '') {
							if (tMat[0] === '') {
								let matArr = doc.Material;
								let categoryMatExist;
								let materialExist = false;
								mat
									.find({})
									.then((totalDoc) => {
										for (let i = 0; i < materialAdd.length; i++) {
											let tDoc = totalDoc;
											let catLength = tDoc.length;
											// console.log(tDoc);
											for (let k = 0; k < catLength; k++) {
												let materialArr = tDoc[k].Material;
												// console.log(materialArr);
												for (let j = 0; j < materialArr.length; j++) {
													if (materialArr[j].MaterialName === materialAdd[i]) {
														materialExist = true;
														categoryMatExist = tDoc[k].Category;
														errors.push({
															msg:
																'Material: ' +
																materialAdd[i] +
																' already exist in the ' +
																categoryMatExist
														});
														purchase = 'mat_Vendor_Update';
														res.render('purchDashboard', {
															purchase,
															materialList,
															materialListTemp,
															vendSearch,
															catSearch,
															errors
														});
														console.log(
															'why are you adding another material to this AABBAA'
														);
														break;
													} else {
														console.log(
															'Material Not found in other categories and is good for addition'
														);
													}
												}
											}

											if (materialExist === false) {
												let newMaterialUpload = {
													MaterialName: materialAdd[i],
													Vendors: [ vendSearch ]
												};
												matArr.push(newMaterialUpload);
											} else {
											}
										}
										mat
											.findOneAndUpdate({ Category: catSearch }, { Material: matArr })
											.then((doc) => {
												console.log('Just added a new material to ' + catSearch);
											})
											.catch((err) => {
												console.log('There is a problem with the addition of new material');
											});
									})
									.catch((err) => {
										console.log('error looking up total list' + err);
									});
							} else {
								let matArr = doc.Material;
								let materialExist = false;
								let categoryMatExist;
								mat
									.findOne({ Category: catSearch })
									.then((tempp) => {
										for (let i = 0; i < materialAdd.length; i++) {
											let matIndex = matArr.findIndex((mat) => {
												return mat.MaterialName === materialAdd[i];
											});

											//if the material exist go into the next layer
											if (matIndex !== -1) {
												let vendIndex = matArr[matI].Vendors.findIndex((vend) => {
													return vend === vendSearch;
												});
												// console.log(vendIndex);

												if (vendIndex === -1) {
													matArr[matIndex].Vendors.push(vendSearch);
												} else {
													errors.push({
														msg:
															'Material Addition Error :  The vendor Already Exists in for this material: ' +
															materialAdd[i]
													});
													purchase = 'mat_Vendor_Update';
													res.render('purchDashboard', {
														purchase,
														materialList,
														materialListTemp,
														vendSearch,
														catSearch,
														errors
													});
													break;
												}
											} else {
												mat
													.find({})
													.then((totalDoc) => {
														let tDoc = totalDoc;
														let catLength = tDoc.length;

														for (let n = 0; n < catLength; n++) {
															let materialArr = tDoc[n].Material;

															for (let j = 0; j < materialArr.length; j++) {
																if (materialArr[j].MaterialName === materialAdd[i]) {
																	materialExist = true;
																	categoryMatExist = tDoc[n].Category;
																} else {
																	let newMaterial = {
																		MaterialName: materialAdd[i],
																		Vendors: vendSearch
																	};
																	matArr.push(newMaterial);
																	// console.log(matArr);
																}
															}
														}
													})
													.then(() => {
														if (materialExist === false) {
															console.log(
																matArr + ' ------------ this is final material'
															);
															mat
																.findOneAndUpdate(
																	{ Category: catSearch },
																	{ Material: matArr }
																)
																.then((doc) => {
																	console.log('updated material');
																})
																.catch((err) => {
																	console.log(err);
																});
														} else {
															errors.push({
																msg:
																	'This Material already exist in the ' +
																	categoryMatExist
															});
															purchase = 'mat_Vendor_Update';
															res.render('purchDashboard', {
																purchase,
																materialList,
																materialListTemp,
																vendSearch,
																catSearch,
																errors
															});
														}
													});
											}
										}
									})
									.then((doc) => {})
									.catch((err) => {
										console.log('ALPHA12300' + err);
									});
							}
						}

						if (materialPop[0] !== undefined && materialPop[0] !== '') {
							mat
								.findOne({ Category: catSearch })
								.then((doc) => {
									let matArr = doc.Material;
									for (let i = 0; i < materialPop.length; i++) {
										let matIndex = matArr.findIndex((material) => {
											return material.MaterialName === materialPop[i];
										});
										console.log('');

										console.log(
											'Before any Changes -------------------------------------------****'
										);

										console.log('');

										console.log(matArr);
										let vendIndex = matArr[matIndex].Vendors.indexOf(vendSearch);

										matArr[matIndex].Vendors.splice(vendIndex, 1);

										console.log('');

										console.log(
											'After any Changes -------------------------------------------****'
										);

										console.log('');

										console.log(matArr);

										console.log('');

										let emptyMaterial = matArr[matIndex].Vendors[0] === undefined;
										if (emptyMaterial) {
											console.log(
												'After any Deletion -------------------------------------------****'
											);

											console.log('');

											matArr.splice(matIndex, 1);

											console.log(matArr);
										}
									}

									mat
										.findOneAndUpdate({ Category: catSearch }, { Material: matArr })
										.then((doc) => {
											console.log(
												'deleted material ' +
													materialPop[i] +
													' because it had no vendors that support it'
											);
										})
										.catch((err) => {
											err;
										});

									console.log('');
									console.log('');
								})
								.catch((err) => {
									console.log(err);
								});
						}
					})
					.catch((err) => {
						console.log(err);
					});
			} else {
				// if nothing was added or removed then ....
				req.flash('error_msg', 'Nothing Was Changed');
				res.redirect('/ABH_Purchase/Modify_Material');
			}
		}
	});

	/////////////////////////////////////////////////////////////////////////////////TODO:

	app.get('/ABH_Purchase/Add_Category', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		purchase = 'addCat';
		res.render('purchDashboard', { purchase });
	});

	app.post('/Add_Category', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		let { categoryIn } = req.body;
		categoryIn = categoryIn.toUpperCase();
		mat
			.find({ Category: categoryIn })
			.then((matList) => {
				if (matList[0] === undefined) {
					let doc = new mat({
						Category: categoryIn
					});
					doc.save((err) => {
						if (err) {
							console.log(err);
						} else {
							req.flash(
								'success_msg',
								'You Have Created Category:  ' +
									categoryIn +
									', If there was a spelling issue you may change it quickly in the modify category page'
							);
							res.redirect('/ABH_Purchase/Add_Category');
							console.log('Created Category:    ' + categoryIn);
						}
					});
				} else {
					req.flash('error_msg', 'This Category Already Exists');
					res.redirect('/ABH_Purchase/Add_Category');
					console.log('category exists');
				}
			})
			.catch(() => {
				console.log('There was a error in the query');
			});
	});

	////////////////////////////////////////////////////////////////////////////

	app.get('/ABH_Purchase/Modify_Category', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		mat.find({}).then((doc) => {
			let docNoMat = new Array();
			for (let i = 0; i < doc.length; i++) {
				let material = doc[i].Material[0];
				if (material === undefined) {
					docNoMat.push(doc[i].Category);
				}
			}
			// console.log(doc[2].Material[0] === undefined);
			// console.log(docNoMat);
			purchase = 'modCat';
			res.render('purchDashboard', { purchase, docNoMat });
		});
	});

	app.post('/Modify_Category', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		      purchase      = 'modCatSub';
		const { catSearch } = req.body;
		res.render('purchDashboard', { purchase, catSearch });
	});

	app.post('/Modify_Category_Submit', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		let { catSearch, catChange } = req.body;
		catChange = catChange.toUpperCase();
		mat.findOneAndUpdate({ Category: catSearch }, { Category: catChange }).then(() => {
			console.log('Category: ' + catSearch + ' has been changed to ' + catChange);
			req.flash('success_msg', 'Category: ' + catSearch + ' has been changed to ' + catChange);
			res.redirect('/ABH_Purchase/Modify_Category').catch((err) => {
				console.log(err);
			});
		});
	});

	app.get('/Modify_Category_Submit', urlencodedParser, purchEnsureAuthenticated, (req, res) => {
		res.redirect('/ABH_Purchase/Modify_Category');
	}); ////////////////////////////////////////////////////////////////////////////

	app.get('/ABH_Purchase/Logout', (req, res) => {
		req.logout();
		req.flash('success_msg', `You have logged out`);
		res.redirect('/ABH_Purchase/Login');
		disconnectABHPharmaDB();
	});

}