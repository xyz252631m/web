// import '../../lib/axios.js';

// require(['../../lib/axios.js'], function (a) {
//     console.log(a)
// })


mi.define("citeTree", function () {
    let svg = mi.loader("../js/svg.min.js", function (arg) {
        // console.log("svg",SVG)
        console.log("svg arg", arg.prototype)
    });
    let axios = mi.loader("../../lib/axios.js", function (arg) {
        //   console.log("axios",axios)
        console.log("axios arg", arg.prototype)
    });

    mi.loader('./tem1.js', function (a) {
        console.log("tem1", a)
    })
    mi.loader('./tem2.js', function (a) {
        console.log("tem2", a)
    })
    mi.loader('./tem3.js', function (a) {
        console.log("tem3", a)
    })
    mi.loader('./tem4.js', function (a) {
        console.log("tem4", a)
    })

    mi.loader('./tem1.js', function (a) {
        console.log("tem1", a)
    })
    mi.loader('./tem2.js', function (a) {
        console.log("tem2", a)
    })
    mi.loader('./tem3.js', function (a) {
        console.log("tem3", a)
    })
    mi.loader('./tem4.js', function (a) {
        console.log("tem4", a)
    })
    // console.log(2,axios)
    // console.log(loader)
})


// let a =new A();
// //21313
// a.add("citeTree1",function () {
//
//     console.log(2314)
// });

// a.citeTree1();


mi.citeTree();






