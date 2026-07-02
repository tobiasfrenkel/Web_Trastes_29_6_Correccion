document.addEventListener("DOMContentLoaded",()=>{


const elements=document.querySelectorAll(
".hero-main h1, .detail-intro h2, .process article"
);


const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});


},{
threshold:.15
});


elements.forEach(el=>observer.observe(el));


}); 