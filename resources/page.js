let next_pages = document.querySelectorAll('.next_number');
let max = next_pages.length-2;
let min = 1;
console.log(max);
next_pages.forEach((page) => {
    page.onclick = () =>{
        
        let active2 = document.querySelector('.active2');
        active2.classList.remove('active2');
        page.classList.add('active2');
        var number = page.innerHTML;
        if(number === '&lt;'){
            let active1 = document.querySelector('.active1');
            var count_number = Number(active1.id);
            if(count_number - 1 <= 0){
                count_number = "3";
                let page_number_2 = document.querySelector('.active2');
                let page_2 = document.querySelector('.active1');
                page_number_2.classList.remove('active2');
                page_2.classList.remove('active1');
                page_2 = document.getElementById(count_number);
                page_2.classList.add('active1');
                page_number_2 = document.querySelectorAll('.next_number');
                page_number_2[max].classList.add('active2');
             
                // page_number_2.classList.add('active2');


                console.log(active1.id.toString());
            }
            else if(count_number-1 > 0){
                count_number = (count_number-1).toString();
                let page_number_2 = document.querySelector('.active2');
                let page_2 = document.querySelector('.active1');
                page_number_2.classList.remove('active2');
                page_2.classList.remove('active1');
                page_2 = document.getElementById(count_number);
                page_2.classList.add('active1');
                page_number_2 = document.querySelectorAll('.next_number');
                page_number_2[Number(count_number)].classList.add('active2');
            }
            console.log(Number(active1.id));
         
        }
        else if(number === '&gt;'){
            let active1 = document.querySelector('.active1');
            var count_number = Number(active1.id);
            if(count_number + 1 > max){
                count_number = "1";
                let page_number_2 = document.querySelector('.active2');
                let page_2 = document.querySelector('.active1');
                page_number_2.classList.remove('active2');
                page_2.classList.remove('active1');
                page_2 = document.getElementById(count_number);
                page_2.classList.add('active1');
                page_number_2 = document.querySelectorAll('.next_number');
                page_number_2[min].classList.add('active2');
                console.log(active1.id.toString());
            }
            else if(count_number + 1 <= max){
                count_number = (count_number+1).toString();
                let page_number_2 = document.querySelector('.active2');
                let page_2 = document.querySelector('.active1');
                page_number_2.classList.remove('active2');
                page_2.classList.remove('active1');
                page_2 = document.getElementById(count_number);
                page_2.classList.add('active1');
                page_number_2 = document.querySelectorAll('.next_number');
                page_number_2[Number(count_number)].classList.add('active2');
            }
        }
        else{
            console.log(number);
            let active1 = document.querySelector('.active1');
            var page_number = document.getElementById(number);
            active1.classList.remove('active1');
            page_number.classList.add('active1');
        }
    }
})