document.addEventListener("DOMContentLoaded", () => {
  const itemSelector = function () {
    var navHeadingItems = document.querySelectorAll(".items");
    var ContentLoader = document.querySelectorAll(".feature_arch");

    navHeadingItems.forEach((element) => {
      element.addEventListener("click", function () {
        navHeadingItems.forEach((elem) => {
          elem.classList.remove("selected");
        });

        ContentLoader.forEach(function (e) {
          e.style.display = "none";
        });

        this.classList.add("selected");

        const index = Array.from(navHeadingItems).indexOf(this);
        ContentLoader[index].style.display = "flex";
      });
    });
  };
  const navScoll = () => {
    let lastScrollTop = 0;
    const navbar = document.querySelector("nav");

    window.addEventListener("scroll", () => {
      let currentScroll = window.scrollY || document.documentElement.scrollTop;

      if (currentScroll > lastScrollTop) {
        navbar.style.transform = "translateY(-100%)";
      } else {
        navbar.style.transform = "translateY(0)";
      }

      lastScrollTop = currentScroll;
    });
  };

  const mousePointer = () => {
    const follower = document.querySelector(".cursor-follower");
    follower.style.display = "block";

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    const smoothFactor = 0.1;

    document.addEventListener("mousemove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    });

    function moveFollower() {
      currentX += (targetX - currentX) * smoothFactor;
      currentY += (targetY - currentY) * smoothFactor;

      follower.style.transform = `translate(${currentX}px, ${currentY}px)`;

      requestAnimationFrame(moveFollower);
    }

    moveFollower();
  };

  const sideBarMover = () => {
    var menuIcon = document.querySelector("#rightNav .menu-icon");
    var sideBar = document.querySelector(".side-bar");
    var sideBarShadow = document.querySelector(".side-bar-shadow");
    var closeBtn = document.querySelector(".close-btn");

    menuIcon.addEventListener("click", function () {
      console.log("hello world!");
      menuIcon.style.display = "none";
      sideBarShadow.style.left = 0;
      sideBar.style.left = 0;
    });

    closeBtn.addEventListener("click", function () {
      menuIcon.style.display = "flex";
      sideBarShadow.style.left = "-100%";
      sideBar.style.left = "-100%";
    });
  };

  sideBarMover();
  mousePointer();
  navScoll();
  itemSelector();
});
