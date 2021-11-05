
function Validator(options) { // options: trả về cái object đưa vào trong Validator ở HTML

    function getElementPararent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){ // tìm ra cái class = "form-group" // matches sẽ truyền cái class mà mình đặt vào
                // console.log(element.parentElement);
                return element.parentElement; // trả về hẳn 1 thẻ <div class = "form-group"></div>
            }
            element = element.parentElement;
        }
    }
/**
 * Validator.isRequired = function(selector,message){ // không ảnh hướng đến cái function Validator
    return {
        selector: selector,  // trả về key bên html
        test1: function(value){ // kiểm tra người dùng đã nhập chưa
            if(value){ // nếu có nhập thì trả về undefined còn ngược lại trả về 'Vui lòng nhập trường nay'
                return undefined;
            }
            else return message || "Vui lòng nhập trường này";
        }
    };
}
 */


    // Hàm thực hiện validate
    var selectorRules = {};
    function validate(inputElement,rule) { // inputElement: lấy thẻ <input>, rule là lấy cái phần tử nhỏ trong Rules của object

        // hàm thực hiện validate
        // var errorElement = inputElement.parentElement.querySelector('.form-message'); // cách 1
        var errorElement = getElementPararent(inputElement,options.formGroup).querySelector('.form-message'); // cách 2: dùng với mọi trường hợp
        var errorMessage;
        var rules = selectorRules[rule.selector];  // rules là 1 mảng chứa các function
        // console.log(rules);
        // console.log(selectorRules[rule.selector]);
        for(var i = 0; i < rules.length; i++) { // rules[i] là 1 function(inputElement.value)
            // console.log(inputElement.value);
            switch(inputElement.type){
                // Đoạn này là khi nhấn onsubmit nhưng chỉ dùng querySelector nên chắc chắn sẽ lấy ra value là male, nhưng quan trọng là lấy ra type của thẻ input và trỏ trực tiếp đến rule.selector mà đã có checked hay không.
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](formDocuments.querySelector(rule.selector + ':checked')); // chỉ đến cái có name = gender và gắn thêm checked, khi người dùng chọn tích thì auto có checked ở 1 trong 3 thẻ bất kì, nếu như không thích thì nó sẽ trả về null và sẽ rơi else "vui lòng nhập trường nay"
                    break;
                default: 
                    console.log([inputElement]); // đói với select, khi chọn thì lập tức value của option được nhận  
                    errorMessage = rules[i](inputElement.value); // trả về dữ liệu người dùng
            }
            
            // errorMessage = rules[i](inputElement.value); (đừng quên dòng này) // nó trả về dữ liệu mà người dùng nhập vào input, dữ liệu đầu tiên sẽ đi vào isRequired này và kiểm tra, khi kiểm tra nó là 1 dạng toàn chữ thì nó sẽ tiếp tục vòng lặp và kiểm tra đến function của isEmail, lúc này thì thay vào vào kiểm tra định dạng email
            // console.log(rule[i]);
            // console.log(inputElement.value)
            // console.log(errorMessage); // errorMessage là cái mà return ở các test1
            if(errorMessage) break; // nếu errorMessage có chữ thì if thực hiện, còn nếu là undefined thì không thực hiện
            // ở đây không có khái niệm hoặc không được hiểu là == true hoặc == false
            // ở đây chỉ được hiểu là có chữ thì break, còn không có chữ hoặc undefined thì lượn
        }

        if(errorMessage){
            errorElement.innerHTML = errorMessage; // thay content ở thẻ span
            getElementPararent(inputElement,options.formGroup).classList.add('invalid');
        }
        else {
            errorElement.innerHTML = '';    // thay content ở thẻ span
            getElementPararent(inputElement,options.formGroup).classList.remove('invalid');
        }
        return !errorMessage; // trả về bool true hoặc false // 
        // false : thì người dùng đã nhập đủ và đúng
        // true : người dùng nhập sai hoặc không nhập
    }
    var formDocuments = document.querySelector(options.form);
    if(formDocuments){ // khác so với formDocument === true ( formdocument ở đây trả về 1 thẻ form), khi if như này, nó mà có giá trị thì auto chạy
        
        // Khi submit form
        formDocuments.onsubmit = function(e){
            e.preventDefault();
            var isFormValid = true;
            options.rules.forEach(function(rule, index){
                var inputElement = formDocuments.querySelector(rule.selector); // cho ta biết được cái id cần trỏ vào
                var isValid = validate(inputElement,rule);    // đưa được thẻ <input> và các rule nhỏ bên trong
                if(isValid === false) {
                    isFormValid = false;
                }
            });
           
            if(isFormValid === true) {
                if(typeof options.onSubmit === 'function') { // đối với có hàm bên html  onSubmit: function(data) {}
                    var ennableInput = formDocuments.querySelectorAll('[name]');
                    // console.log(ennableInput);

                    var formValues = Array.from(ennableInput).reduce(function (values,input){
                        console.log(input); // in ra các ~rule
                        switch(input.type){
                            case 'radio':
                                values[input.name] = formDocuments.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')) return values; // kiểm tra nếu không có check nào trong cả 3 option thì return luôn
                                if(!Array.isArray(values[input.name])){ 
                                    values[input.name]= [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    },{}); // phải chuyển sang vì dạng NodeList không dùng được phương thức reduce
                    options.onSubmit(formValues);
                }
                else{                       // đối với không có onSubmit: function(data) {}
                    formDocuments.submit();
                }

            }
        }




        // Lặp qua mỗi rule và xử lý(lắng nghe sự kiện blur, input)
        options.rules.forEach(function(rule, index){ // rule là cái return ở dưới
            // console.log(rule);
            // console.log(index);

            // Lưu lại các rule trong mỗi input
            // console.log(rule.selector);
            if(Array.isArray(selectorRules[rule.selector]) === true) {
                selectorRules[rule.selector].push(rule.test1);
            }
            else{
                selectorRules[rule.selector] = [rule.test1];
            }
            
            var inputElements = formDocuments.querySelectorAll(rule.selector); // cho ta biết được cái id cần trỏ vào
            // console.log('Duong');
            // console.log(inputElements);
            // console.log('Duong123');
            Array.from(inputElements).forEach(function(inputElement){
                console.log(inputElement);
                var errorElement = getElementPararent(inputElement,options.formGroup).querySelector('.form-message') // trỏ đến cái span message
                if(inputElement){
                    // xử lí trường hợp blur khỏi input
                    inputElement.onblur = function(){ // lăng nghe sự kiện khi dung chuột trỏ đến và không trỏ đến nữa
                        // console.log(rule.test);
                        // đưa được thẻ <input> và các rule nhỏ bên trong
                        validate(inputElement,rule);
                    }
                    // xử lý mỗi người dùng nhập input
                    inputElement.oninput = function(){ // quá trình mình nhập chữ vào các ô input
                        errorElement.innerHTML = '';
                        getElementPararent(inputElement,options.formGroup).classList.remove('invalid');
                    }
                }
            });




            
        })
    }
}



// Định nghĩa rule;
// Nguyên tắc rules'
// 1. Khi có lỗi => trả ra message;
// 2. khi jopwj => không trả ra gì
Validator.isRequired = function(selector,message){ // không ảnh hướng đến cái function Validator
    return {
        selector: selector,  // trả về key bên html
        test1: function(value){ // kiểm tra người dùng đã nhập chưa
            if(value){ // nếu có nhập thì trả về undefined còn ngược lại trả về 'Vui lòng nhập trường nay'
                return undefined;
            }
            else return message || "Vui lòng nhập trường này";
        }
    };
}
Validator.isEmail= function(selector, message){
    return {
        selector: selector,  // trả về key bên html
        test1: function(value){ // kiểm tra người dùng đã đúng email chưa
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if(regex.test(value)){
                return undefined;
            }
            else return message || "Trường này phải là email";
        }
    }
}
Validator.minlength = function(selector, min, message){
    return {
        selector: selector,  // trả về key bên html
        test1: function(value){ // kiểm tra người dùng đã đúng email chưa
             return value.length >= min ? undefined : message || `Vui lòng nhập tối thiếu ${min} ký tự`;
        }
    }
}
Validator.isConfimed = function(selector, getPassword, message){
    return {
        selector: selector,
        test1: function(value){
            if(value === getPassword()){
                return undefined;
            }
            else return message || 'Giá trị nhập vào không chính xác'; // nếu không có message thì lấy cái string ở sau ||
        }
    }

}

// if(String123){ // nếu có chữ thì in ra
//     console.log(String123);
// }
// else console.log("false"); 
// nếu không có chữ thì in ra