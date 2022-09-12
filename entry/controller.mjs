import Product from "#models/product";
import Category from "#models/category";
import Media from "#models/media";
import requestIp from "request-ip";
import _ from "lodash";
import path from "path";
import fs from "fs";
import moment from "moment-jalaali";
import axios from "axios";
import mime from "mime";
import global from "#root/global";
import mongoose from "mongoose";
import CONFIG from "#c/config";
import {CollectContent, DownloadContent, OpenLinks, Root, Scraper} from 'nodejs-web-scraper';

var Self = {
    atefe: function (req, res, next) {
        console.log('atefe...', req.body.query);
        // async () => {
        //     console.log('atefe2...');
        sql.connect({
            user: "sa",
            password: "123456",
            database: "arvand",
            server: '80.210.32.186',
            port: 1433,
            options: {
                encrypt: false, // for azure
            }
        }).then(pool => {
            // Query
            console.log('pool...');

            return pool.request()
                .query(req.body.query)
        }).then(result => {
            // console.log('result...');
            res.json({
                success: true,
                result: result
            })

            // console.dir(result);
        }).catch(err => {
            // console.log('error...');
            res.json({
                err: err
            })
            // ... error checks
        });

    },
    entryPerDate: async function (req, res, next) {
        let search = {};
        // search['activities.status'] = "نیاز به تماس مجدد";
        // let yesterday = moment().subtract(1, 'day').toDate();
        // console.log('yesterday',yesterday);
        if (!req.params.limit) {
            req.params.limit = 7;
        }
        let c = [], counter = 0;
        var now = new Date();
        let f = _.range(0, req.params.limit);
        console.log('f', f);
        var yesterday = new Date();

        _.forEach(f, (current, index) => {
            console.log(current, index);
            let now = yesterday;
            yesterday = new Date(yesterday.setDate((now.getDate() - 1)));

            console.log('now', now, 'yesterday', yesterday);
            // console.log('yesterday', yesterday);
            Entry.countDocuments({

                createdAt: {
                    $lt: now,
                    $gte: yesterday
                }
            }, function (err, count) {


                View.findOne({

                    date: now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate()
                }, function (err, VVV) {
                    let co = 0, uv = 0;
                    let unicViews = [];
                    if (VVV && VVV.views && VVV.views.length) {
                        co = VVV.views.length;
                        _.forEach(VVV.views, function (item, i) {
                            let found = _.some(unicViews, el => el.userIp === item.userIp);
                            if (!found) {
                                unicViews.push({userIp: item.userIp, createdAt: new Date()})
                            }
                        });

                    }
                    if (unicViews && unicViews.length > 0) {
                        uv = unicViews.length;
                    }
                    c[index] = ({
                        date: now,
                        count: count,
                        // views: co,
                        unicViews: uv
                    });
                    counter++;
                    console.log("c[" + index + "] pushed: ", now, " * ", count, counter)
                    if (counter == req.params.limit) {
                        res.json({
                            success: true,
                            results: c
                        });
                    }
                    // now = yesterday;
                });

            });

        });

    },
    
    allW: function (req, res, next) {
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (req.params.search) {
            // search={$text: {$search:req.params.search}};
            if (parseInt(req.params.search)) {
                search = {"$where": "function() { return this.phone_number.toString().match(/" + req.params.search + "/) != null; }"};


            } else {
                search = {"title": {"$regex": req.params.search, "$options": "i"}};

            }
        }
        // if (req.headers._id)
        //     search.user = req.headers._id;
        search['activities'] = {$size: 0};

        Entry.find(search, function (err, customers) {

            if (err) {
                res.json({
                    success: false,
                    message: 'error!'
                });
            } else {
                customers.map((item, i) => {
                    item.num = (i + 1) + offset
                });
                res.json(customers);


            }
        }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit)).lean();

    },
    allWating: function (req, res, next) {
        let offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        let search = {};
        if (req.params.search) {
            // search={$text: {$search:req.params.search}};
            if (parseInt(req.params.search)) {
                search = {"$where": "function() { return this.phone_number.toString().match(/" + req.params.search + "/) != null; }"};


            } else {
                search = {"title": {"$regex": req.params.search, "$options": "i"}};

            }
        }
        // if (req.headers._id)
        //     search.user = req.headers._id;
        // search['activities'] = {$size: 0};
//     search['activities.status'] = "نیاز به تماس مجدد";
//     $or: [{
//       "activities.status": "نیاز به تماس مجدد"
//     }, {
//       "activities.status": "نیاز به تماس مجدد"
//     }]
// console.log('are we here');
        Entry.find({
            // "$expr": {
            //     "$and": [
            //         { "$eq": ["$name", "development"] },
            //         { "$gte": [{ "$size": "$followers" }, followers_count ]}
            //     ]
            // }

            $or: [{

                $expr: {
                    $let: {
                        vars: {last: {$arrayElemAt: ["$activities", -1]}},
                        in: {$eq: ["$$last.status", "نیاز به تماس مجدد"]}
                    }
                }
            }, {

                $expr: {
                    $let: {
                        vars: {last: {$arrayElemAt: ["$activities", -1]}},
                        in: {$eq: ["$$last.status", "پاسخ گو نبودند"]}
                    }
                }
            }

            ]
            //
            // $or: [{
            //     "activities.status": "نیاز به تماس مجدد"
            // }, {
            //     "activities.status": "پاسخ گو نبودند"
            // }]
        }, function (err, customers) {

            if (err) {
                res.json({
                    success: false,
                    message: 'error!'
                });
            } else {
                customers.map((item, i) => {
                    item.num = (i + 1) + offset
                });
                res.json(customers);


            }
        }).skip(offset).sort({_id: -1}).limit(parseInt(req.params.limit)).lean();

        // Entry.aggregate([
        //     {
        //         $match: {
        //             $expr: {
        //                 $let: {
        //                     vars: {last: {$arrayElemAt: ["$activities", -1]}},
        //                     in: {$eq: ["$$last.status", "پاسخ گو نبودند"]}
        //                 }
        //             }
        //         }
        //     }
        // ])

    },
    
    trackingCode2: function (req, res, next) {
        console.clear();
        console.log('req.params', req.params.trackingCode);
        Entry.findOne({"trackingCode": req.params.trackingCode},
            function (err, response) {
                if (err || !response) {
                    res.json({
                        success: false,
                        message: 'error!'
                    });
                    return;
                }
                let usersArray = [], Activities = response.activities;
                if (!Activities) {
                    Activities = [];
                }
                let message = 'درخواست شما در حال بررسی است. بزودی تعیین وضعیت خواهد شد', status = '';
                // if (Activities && Activities[Activities.length - 1] && Activities[Activities.length - 1].description)
                //     message = Activities[Activities.length - 1].description;
                if (Activities && Activities[Activities.length - 1] && Activities[Activities.length - 1].status) {
                    status = Activities[Activities.length - 1].status;
                    userStatus = Activities[Activities.length - 1].userStatus;
                    if (userStatus) {
                        status = userStatus;
                    }
                    message = 'درخواست شما در وضعیت ' + '"' + status + '"' + ' قرار دارد.';
                    status = '';
                }
                res.json({
                    success: true,
                    message: message,
                    status: status,
                    response: response
                });

            }).lean();

        // console.log('Viewing ' + req.params.id);
    },
    
    createW: function (req, res, next) {
        console.log('createW');
        if (req.headers._id)
            req.body.user = req.headers._id;
        req.body.trackingCode = Math.floor(100000 + Math.random() * 900000);
        let obj = {
            "trackingCode": req.body.trackingCode
        };
        if (!req.body.form_id) {
            obj = req.body;
        } else {
            let entry = {
                // "id": 0,
                // "form_id": req.body.form_id,

            };
            let input_values = [];
            _.forEach(req.body.fields, (field, fi) => {
                if (field['field_id']) {
                    let stringf = 'input_' + field['field_id'];
                    input_values[stringf] = field['value'];
                    entry[field['field_id']] = field['value'];
                }
                if (field['field_number']) {
                    let stringf = 'input_' + field['field_number'];
                    input_values[stringf] = field['value'];
                    entry[field['field_number']] = field['value'];
                }

            });
            entry['55'] = '0';
            let $extra = entry['34'];
            let $Email = entry['13'];
            let $Mobile = entry['26'];
            let $Name = entry['12'];
            let $Claim = entry['36'];
            if (!$Claim) {
                $Claim = entry['51'];
            }
            let $Model = entry['17'];
            if (!$Model) {
                $Model = entry['60'];
            }
            if (!$Model) {
                $Model = entry['37'];
            }
            if (!$Model) {
                $Model = entry['52'];
            }
            if (!$Model) {
                $Model = entry['54'];
            }
            if (!$Model) {
                $Model = entry['59'];
            }
            if (!$Model) {
                $Model = entry['58'];
            }
            let $Brand = entry['28'];
            if (!$Brand) {
                $Brand = entry['44'];
            }
            if (!$Brand) {
                $Brand = entry['45'];
            }
            if (!$Brand) {
                $Brand = entry['46'];
            }
            if (!$Brand) {
                $Brand = entry['47'];
            }
            if (!$Brand) {
                $Brand = entry['48'];
            }
            if (!$Brand) {
                $Brand = entry['29'];
            }
            let $device = entry['43'];
            obj['mobile'] = $Mobile;
            obj['name'] = $Name;
            obj['device'] = $device;
            obj['brand'] = $Brand;
            obj['model'] = $Model;
            obj['claim'] = $Claim;
            obj['extra'] = $extra;
            obj['Email'] = $Email;
        }

        console.log('obj=>', obj);
        if (req.params && req.params['form_id']) {
            obj['form_id'] = req.params['form_id']
        }
        console.log('date', new Date());
        obj['createdAt'] = new Date();
        obj['updatedAt'] = new Date();

        if (req.body.dcode) {
            Dcode.findOne({code: req.body.dcode},
                function (err, response) {
                    if (err || !response) {
                        res.json({
                            success: false,
                            message: 'کدی یافت نشد!'
                        })
                        return;
                    } else {
                        if (response.limit && response.limit < 1) {
                            res.json({
                                success: false,
                                message: 'کدی یافت نشد!'
                            })
                            return;
                        }
                        response.limit = response.limit - 1;
                        Dcode.findOneAndUpdate({code: req.body.dcode}, {limit: response.limit},
                            function (err, response) {
                                if (err || !response) {
                                    res.json({
                                        success: false,
                                        message: 'کدی بروز نشد!'
                                    })
                                    return;
                                } else {
                                    Entry.create(obj, function (err, post) {
                                        if (err || !post) {
                                            res.json({
                                                success: false,
                                                message: 'error!',
                                                err: err
                                            })
                                        } else {
                                            // res.json({
                                            //     success: true,
                                            //     is_valid: true,
                                            //     dcode: post.dcode,
                                            //     createdAt: post.createdAt,
                                            //     entry_id: post.trackingCode,
                                            //     "dialog-title": 'تائید درخواست',
                                            //     "dialog-button-text": "بازگشت به صفحه اصلی",
                                            //     confirmation: 'با تشکر از شما. اطلاعات شما با موفقیت ارسال شد.' + 'کد رهگیری: ' + post.trackingCode
                                            // })
                                            if (obj['device']) {
                                                if (obj['device'].toUpperCase() == 'LAPTOP')
                                                    obj['device'] = 'NOTEBOOK'; //نوع
                                                if (obj['device'].toUpperCase() == 'CONSOLE') {
                                                    obj['device'] = 'GAMING CONSOLE';
                                                }
                                                if (obj['device'].toUpperCase() == 'SURFACEFAMILY') {
                                                    obj['device'] = 'SURFACE';
                                                    obj['brand'] = 'MICROSOFT'; //مارک
                                                }
                                            }
                                            let verdes = "model: " + (obj['model'].toUpperCase() || "____") + '/\n' +
                                                "device(نوع): " + (obj['device'] || "____") + '/\n' +
                                                "brand(مارک): " + (obj['brand'].toUpperCase() || "____") + '/\n' +
                                                "claim: " + (obj['claim:'] || "____") + '/\n' +
                                                "extra: " + (obj['extra'] || "____");
                                            let options = {
                                                method: 'POST',
                                                uri: 'http://customerapi.sorooshan.org/Arvand/api/Home/InsertVirtualReception',
                                                body: {
                                                    "SvCode": "SV00000001",
                                                    "ServiceType": "تعمیر",
                                                    "Model": "",
                                                    // "Model": obj['model'].toUpperCase(),
                                                    "TelNo": obj['mobile'].toString(),
                                                    "App": "",
                                                    // "App": obj['device'].toUpperCase(),
                                                    "Brand": "",
                                                    // "Brand": obj['brand'].toUpperCase(),
                                                    "CustomerName": obj['name'],
                                                    "EmailAddress": obj['Email'],

                                                    "VrDes": verdes,
                                                    "ContactPersonName": obj['name']
                                                },
                                                headers: {
                                                    'Host': 'customerapi.sorooshan.org',
                                                    'Connection': 'keep-alive',
                                                    'Content-Type': 'application/json',
                                                    'Accept': '*/*',
                                                    'Accept-Encoding': 'gzip, deflate',
                                                    'User-Agent': 'PostmanRuntime/7.19.0',
                                                    'Authorization': 'Bearer eyJhbGciOiJBMTI4S1ciLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwidHlwIjoiSldUIn0.5IAwh8nlByQLE6BUixKlmFpkauyZixdU4pFf1now_8nAy4ZlipsTAw.1e0M5b0VI3MV9VdMszeWJg.hbspxxvzrF7B9rbxQTaZ9CEpVOdKNPDGjuv5AyTUGflNsdnwI8gX2wGof8YJ5HX18H4xpowC86r8k4f3gb6Zk-rq9laKdAT2gNdbfM3gFsbKvKa31BZYjfzQWFiCYoU37rxq42PFEb6Ib80CkulcbUnkNNSDEvJFpGeBIqGOkLkUWbgiwAAgQd_cscZViHquc-goFL6N7Lv3klyVhqFsf-3bW1eI4666aOXR_5e9RAFOCpDWYb_UQktKTc6mw8h54GcnJz_onUsY5Mg6UANayA.cA0OZRatA-ZSCiGNtMJr8w'
                                                },
                                                json: true // Automatically stringifies the body to JSON
                                            };
                                            axios.post(options['uri'], options['body'], {headers: options['headers']})
                                                .then(function (response) {

                                                    console.log('responseW', response);
                                                    res.json({
                                                        success: true,
                                                        body: options['body'],
                                                        response: response['data'],
                                                        is_valid: true,
                                                        dcode: post.dcode,
                                                        createdAt: post.createdAt,
                                                        entry_id: post.trackingCode,
                                                        "dialog-title": 'تائید درخواست',
                                                        "dialog-button-text": "بازگشت به صفحه اصلی",
                                                        confirmation: 'با تشکر از شما. اطلاعات شما با موفقیت ارسال شد.' + 'کد رهگیری: ' + post.trackingCode,

                                                        message: 'response',
                                                    });
                                                    return 0;
                                                })
                                                .catch(function (error) {
                                                    console.log(error);
                                                    res.json({
                                                        success: false,
                                                        error: error,
                                                        message: 'error',
                                                    });
                                                    return 0;
                                                });
                                            rp(options)
                                                .then(function (parsedBody) {
                                                    // console.log('parsedBody:', parsedBody, title, body);
                                                    console.log('sent to soorooshan!');
                                                })
                                                .catch(function (err) {
                                                    //  console.log('err:', err);
                                                    res.json({
                                                        success: true,
                                                        err: err,
                                                        message: 'مشکل در ارسال به سروشان!',
                                                    });
                                                    return 0;

                                                });

                                        }
                                    });

                                    return;
                                }
                            });
                        return;
                    }
                }).lean();

        } else {
            Entry.create(obj, function (err, post) {
                if (err || !post) {
                    res.json({
                        success: false,
                        message: 'error!',
                        err: err
                    })
                } else {
                    // console.log(obj, post);
                    console.log('tttttt');
                    let $text = 'با سپاس، کد رهگیری:';
                    // $text += "\n";
                    $text += post.trackingCode.toString();
                    // $text += "\n";
                    // $text += "از طریق لینک زیر میتوانید وضعیت دستگاه خود را چک کنید:";
                    $text += "\n";
                    $text += "لینک پیگیری:";
                    $text += "\n";
                    $text += "https://arvandguarantee.com/repair-request/" + "\n";
                    $text += "گارانتی آروند";
                    if (!obj['mobile']) {
                        res.json({
                            success: false,
                            message: 'phone number not entered!'
                        })
                        return;
                    }
                    let phjkjh = obj['mobile'].toString();
                    if (phjkjh.substr(0, 1) == "0") {
                        phjkjh = phjkjh.substr(1);
                    }
                    phjkjh = "98" + phjkjh;
                    // global.sendSms(Number(phjkjh), $text);
                    // res.json({
                    //     success: true,
                    //     // response: response['data'],
                    //     is_valid: true,
                    //     dcode: post.dcode,
                    //     // body2: options['body'] || {},
                    //     createdAt: post.createdAt,
                    //     entry_id: post.trackingCode,
                    //     "dialog-title": 'تائید درخواست',
                    //     "dialog-button-text": "بازگشت به صفحه اصلی",
                    //     confirmation: 'با تشکر از شما. اطلاعات شما با موفقیت ارسال شد.' + 'کد رهگیری: ' + post.trackingCode,
                    //
                    //     message: 'response',
                    // });
                    // return 0;
                    // res.json({
                    //     success: true,
                    //     post: post
                    // })
                    // return 0;
                    //
                    // let options = {
                    //     method: 'POST',
                    //     uri: 'http://customerapi.sorooshan.org/Arvand/api/Home/InsertVirtualReception',
                    //     body: {
                    //         "SvCode": "SV00000001",
                    //         "ServiceType": "تعمیر",
                    //         "Model": obj['model'].toUpperCase(),
                    //         "TelNo": obj['mobile'].toString(),
                    //         "App": obj['device'].toUpperCase(),
                    //         "Brand": obj['brand'].toUpperCase(),
                    //         "CustomerName": obj['name'],
                    //         "EmailAddress": obj['Email'],
                    //         "VrDes": obj['claim'] + '/' + obj['extra'],
                    //         // "ContactPersonName": obj['name']
                    //     },
                    //     headers: {
                    //         'Host': 'customerapi.sorooshan.org',
                    //         'Connection': 'keep-alive',
                    //         'Content-Type': 'application/json',
                    //         'Accept': '*/*',
                    //         'Accept-Encoding': 'gzip, deflate',
                    //         'User-Agent': 'PostmanRuntime/7.19.0',
                    //         'Authorization': 'Bearer eyJhbGciOiJBMTI4S1ciLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwidHlwIjoiSldUIn0.5IAwh8nlByQLE6BUixKlmFpkauyZixdU4pFf1now_8nAy4ZlipsTAw.1e0M5b0VI3MV9VdMszeWJg.hbspxxvzrF7B9rbxQTaZ9CEpVOdKNPDGjuv5AyTUGflNsdnwI8gX2wGof8YJ5HX18H4xpowC86r8k4f3gb6Zk-rq9laKdAT2gNdbfM3gFsbKvKa31BZYjfzQWFiCYoU37rxq42PFEb6Ib80CkulcbUnkNNSDEvJFpGeBIqGOkLkUWbgiwAAgQd_cscZViHquc-goFL6N7Lv3klyVhqFsf-3bW1eI4666aOXR_5e9RAFOCpDWYb_UQktKTc6mw8h54GcnJz_onUsY5Mg6UANayA.cA0OZRatA-ZSCiGNtMJr8w'
                    //     },
                    //     json: true // Automatically stringifies the body to JSON
                    // };
                    // console.log('options', options);
                    // rp(options)
                    //     .then(function (parsedBody) {
                    //         console.log('parsedBody:', parsedBody, title, body);
                    //         res.json({
                    //             success: true,
                    //             is_valid: true,
                    //             dcode: post.dcode,
                    //             createdAt: post.createdAt,
                    //             entry_id: post.trackingCode,
                    //             "dialog-title": 'تائید درخواست',
                    //             "dialog-button-text": "بازگشت به صفحه اصلی",
                    //             confirmation: 'با تشکر از شما. اطلاعات شما با موفقیت ارسال شد.' + 'کد رهگیری: ' + post.trackingCode
                    //         });
                    //         return 0;
                    //     })
                    //     .catch(function (err) {
                    //         //  console.log('err:', err);
                    //         res.json({
                    //             success: false,
                    //             err: err,
                    //             message: 'مشکل در ارسال به سروشان!',
                    //         });
                    //         return 0;
                    //
                    //     });
                    let devi = '', model = '', brand = '';
                    if (obj['brand']) {
                        brand = obj['brand'].toUpperCase()
                    }
                    if (obj['model']) {
                        model = obj['model'].toUpperCase()
                    }
                    if (obj['device']) {
                        if (obj['device'].toUpperCase() == 'LAPTOP')
                            obj['device'] = 'NOTEBOOK';

                        if (obj['device'].toUpperCase() == 'SURFACEFAMILY') {
                            obj['device'] = 'SURFACE';
                            obj['brand'] = 'MICROSOFT';
                        }

                        devi = obj['device'];
                    }
                    let verdes = "model: " + (model || "____") + '/\n' +
                        "device(نوع): " + (devi || "____") + '/\n' +
                        "brand(مارک): " + (brand || "____") + '/\n' +
                        "claim: " + (obj['claim:'] || "____") + '/\n' +
                        "extra: " + (obj['extra'] || "____");

                    let options = {
                        method: 'POST',
                        uri: 'http://customerapi.sorooshan.org/Arvand/api/Home/InsertVirtualReception',
                        body: {

                            "SvCode": "SV00000001",
                            "ServiceType": "تعمیر",
                            "Model": "",
                            // "Model": obj['model'].toUpperCase(),
                            "TelNo": obj['mobile'].toString(),
                            "App": "",
                            // "App": obj['device'].toUpperCase(),
                            "Brand": "",
                            // "Brand": obj['brand'].toUpperCase(),
                            "CustomerName": obj['name'],
                            "EmailAddress": obj['Email'],
                            "VrDes": verdes,
                            "ContactPersonName": obj['name']
                        },
                        headers: {
                            'Host': 'customerapi.sorooshan.org',
                            'Connection': 'keep-alive',
                            'Content-Type': 'application/json',
                            'Accept': '*/*',
                            'Accept-Encoding': 'gzip, deflate',
                            'User-Agent': 'PostmanRuntime/7.19.0',
                            'Authorization': 'Bearer eyJhbGciOiJBMTI4S1ciLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwidHlwIjoiSldUIn0.5IAwh8nlByQLE6BUixKlmFpkauyZixdU4pFf1now_8nAy4ZlipsTAw.1e0M5b0VI3MV9VdMszeWJg.hbspxxvzrF7B9rbxQTaZ9CEpVOdKNPDGjuv5AyTUGflNsdnwI8gX2wGof8YJ5HX18H4xpowC86r8k4f3gb6Zk-rq9laKdAT2gNdbfM3gFsbKvKa31BZYjfzQWFiCYoU37rxq42PFEb6Ib80CkulcbUnkNNSDEvJFpGeBIqGOkLkUWbgiwAAgQd_cscZViHquc-goFL6N7Lv3klyVhqFsf-3bW1eI4666aOXR_5e9RAFOCpDWYb_UQktKTc6mw8h54GcnJz_onUsY5Mg6UANayA.cA0OZRatA-ZSCiGNtMJr8w'
                        },
                        json: true // Automatically stringifies the body to JSON
                    };
                    // console.log('options', options['body'])
                    axios.post(options['uri'], options['body'], {headers: options['headers']})
                        .then(function (response) {

                            console.log('response == ', response['data']);
                            let $text = 'با سپاس، کد رهگیری:';
                            // $text += "\n";
                            $text += post.trackingCode.toString();
                            // $text += "\n";
                            // $text += "از طریق لینک زیر میتوانید وضعیت دستگاه خود را چک کنید:";
                            $text += "\n";
                            $text += "لینک پیگیری:";
                            $text += "\n";
                            $text += "https://arvandguarantee.com/repair-request/#" + "\n";
                            $text += "گارانتی آروند";

                            let phjkjh = obj['mobile'].toString();
                            if (phjkjh.substr(0, 1) == "0") {
                                phjkjh = phjkjh.substr(1);
                            }
                            phjkjh = "98" + phjkjh;
                            global.sendSms(Number(phjkjh), $text);
                            res.json({
                                success: true,
                                response: response['data'],
                                is_valid: true,
                                dcode: post.dcode,
                                body2: options['body'],
                                createdAt: post.createdAt,
                                entry_id: post.trackingCode,
                                "dialog-title": 'تائید درخواست',
                                "dialog-button-text": "بازگشت به صفحه اصلی",
                                confirmation: 'با تشکر از شما. اطلاعات شما با موفقیت ارسال شد.' + 'کد رهگیری: ' + post.trackingCode,

                                message: 'response',
                            });
                            return 0;
                        })
                        .catch(function (error) {
                            console.log(error);
                            res.json({
                                success: false,
                                error: error,
                                message: 'error',
                            });
                            return 0;
                        });
                }
            });
        }

    },
    createD: function (req, res, next) {
        console.log('req', req.body)
        if (req.headers._id)
            req.body.user = req.headers._id;
        req.body.trackingCode = Math.floor(100000 + Math.random() * 900000);
        // let obj = {
        //     "trackingCode": req.body.trackingCode
        // };
        // if (!req.body.form_id) {
        //     obj = req.body;
        // } else {
        // }

        if (req.params && req.params['form_id']) {
            req.body['form_id'] = req.params['form_id']
        }
        console.log(req.body);
        if (req.body.input_1) {
            req.body.name = req.body.input_1
        }
        if (req.body.input_3) {
            req.body.mobile = req.body.input_3
        }
        if (req.body.input_4 && req.body.input_5) {
            req.body.device = req.body.input_4 + " " + req.body.input_5
        }
        console.log('req.body', req.body)
        Entry.create(req.body, function (err, post) {
            if (err || !post) {
                res.json({
                    success: false,
                    message: 'error!',
                    err: err
                })
            } else {

                // res.json({
                //     success: true,
                //     post: post
                // })
                res.json({
                    success: true,
                    is_valid: true,
                    entry_id: post.trackingCode,
                    "dialog-title": 'تائید درخواست',
                    "dialog-button-text": "بازگشت به صفحه اصلی",
                    confirmation: 'با تشکر از شما. اطلاعات شما با موفقیت ارسال شد.' + 'کد رهگیری: ' + post.trackingCode
                })
            }
        });
    },
    
    addStatus: function (req, res, next) {
        console.clear();
        req.body.updatedAt = new Date();
        Status.findOne({
            name: req.body.status
        }, function (erre, ress) {
            if (erre || !ress) {
                res.json({
                    success: false,
                    message: 'error!'
                });
                return 0;

            }
            console.log('wdeef', ress);
            Entry.findByIdAndUpdate(
                req.params.id,
                {
                    $push: {
                        "activities": {
                            user: req.headers._id,
                            status: req.body.status,
                            userStatus: ress.title,
                            description: req.body.description,
                            createdAt: new Date()

                        }
                    }
                }
                , function (err, post) {
                    if (err || !post) {
                        res.json({
                            success: false,
                            message: 'error!'
                        });
                        return 0;
                    }

                    res.json({
                        success: true,
                        post: post
                    })

                });
        });

    },
    count3: function (req, res, next) {
        let search = {};
        if (!req.params.limit) {
            req.params.limit = 1;
        }
        var now = new Date();
        now.setSeconds(0);
        now.setMinutes(0);
        now.setHours(0);
        var yesterday = new Date();
        // now = yesterday;
        yesterday = new Date(yesterday.setDate((now.getDate() - 1)));

        console.log('#####################', yesterday);

        Entry.countDocuments({}, function (err, count) {
            res.json({
                success: true,
                count: count
            })

        });


    },
    countView: function (req, res, next) {
        let search = {};
        // search['activities'] = {$exists: true, $not: {$size: 0}};

        Entry.countDocuments(search, function (err, count) {
            console.log('countDocuments', count);
            if (err) {
                res.json({
                    success: err
                })
            }
            res.json({
                success: true,
                count: count
            })


        });
    },
    countHasSorushan: function (req, res, next) {
        let search = {};
        search['activities'] = {$exists: true, $not: {$size: 0}};
        search['jobNumber'] = {
            $ne: null
        };
        Entry.countDocuments({}, function (err2, count2) {
            // res.json({
            //   success: true,
            //   count: count
            // })


            Entry.countDocuments(search, function (err, count) {
                console.log('countDocuments', count);
                if (err) {
                    res.json(err);
                }
                let gfgh = (count * 100) / count2;
                gfgh = Math.round(gfgh * 100) / 100;
                res.json({
                    success: true,
                    count: gfgh + '% - ' + count + ' عدد'
                })


            });
        });
    },
    countWaitedToCall: function (req, res, next) {
        let search = {};
        search['activities'] = {$exists: true, $not: {$size: 0}};
        search['$or'] = [{

            $expr: {
                $let: {
                    vars: {last: {$arrayElemAt: ["$activities", -1]}},
                    in: {$eq: ["$$last.status", "نیاز به تماس مجدد"]}
                }
            }
        }, {

            $expr: {
                $let: {
                    vars: {last: {$arrayElemAt: ["$activities", -1]}},
                    in: {$eq: ["$$last.status", "پاسخ گو نبودند"]}
                }
            }
        }];
        Entry.countDocuments(search, function (err, count) {
            console.log('countDocuments', count);
            if (err) {
                reject(err);
            }
            res.json({
                success: true,
                count: count
            })


        });
    },
    countC: function (req, res, next) {
        let search = {};
        search['activities'] = {$size: 0};
        Entry.countDocuments(search, function (err, count) {
            console.log('countDocuments', count);
            if (err) {
                reject(err);
            }
            res.json({
                success: true,
                count: count
            })


        });
    },
    countCallWating: function (req, res, next) {
        let search = {};
        // search['activities.status'] = "نیاز به تماس مجدد";
        Entry.countDocuments({

            $or: [{

                $expr: {
                    $let: {
                        vars: {last: {$arrayElemAt: ["$activities", -1]}},
                        in: {$eq: ["$$last.status", "نیاز به تماس مجدد"]}
                    }
                }
            }, {

                $expr: {
                    $let: {
                        vars: {last: {$arrayElemAt: ["$activities", -1]}},
                        in: {$eq: ["$$last.status", "پاسخ گو نبودند"]}
                    }
                }
            }

            ]
        }, function (err, count) {
            console.log('countDocuments', count);
            if (err) {
                reject(err);
            }
            res.json({
                success: true,
                count: count
            })


        });
    },

    photo: function (req, res, next) {
        console.log('req.busboy');

        let fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            let name = getFormattedTime() + filename;
            let filePath = path.join(__dirname, '../public/upload/', name);
            fstream = fs.createWriteStream(filePath);
            file.pipe(fstream);
            fstream.on('close', function () {
                console.log('Files saved');
                let url = 'upload/' + name;
                let obj = [{'name': name, 'url': url}];
                console.log(req.body);

                res.json({
                    success: true,
                    photo: obj
                })

            });
        });
    },
};
export default self;