import LocomotiveScroll from "locomotive-scroll";
import imagesloaded from "imagesloaded";

const scroll = new LocomotiveScroll({
    el: document.querySelector(".scroll-container"),
    smooth: true,
});

imagesloaded(document.querySelectorAll("img"), () => {
    scroll.update();
});

export default scroll;
