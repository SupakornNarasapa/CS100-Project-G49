 const config = {
    backendUrl: "http://localhost:8000/", // Default backend URL
  };
  const port = 8000;

  document.addEventListener('DOMContentLoaded', function () {
    // Animated effect - fade in the whole page
    document.body.style.opacity = 0;
    setTimeout(function () {
      document.body.style.transition = 'opacity 1s';
      document.body.style.opacity = 1;
    }, 0);
  });
  let slideIndex = 0;
  showSlides();
  
  function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
    setTimeout(showSlides, 3000);
  }
  var slideTextIndex = 1;
showTextSlides(slideTextIndex);

function plusSlides(n) {
  showTextSlides(slideTextIndex += n);
}

function currentSlide(n) {
  showTextSlides(slideTextIndex = n);
}

function showTextSlides(n) {
  var i;
  var slides = document.getElementsByClassName("myTextSlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideTextIndex = 1}
    if (n < 1) {slideTextIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
  slides[slideTextIndex-1].style.display = "block";
  dots[slideTextIndex-1].className += " active";
}
  