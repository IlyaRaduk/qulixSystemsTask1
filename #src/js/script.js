document.addEventListener('DOMContentLoaded', function () {
    // Бургер меню
    const btnOpenBurgerMenu = document.querySelector('.burger-btn');
    const burgerMenu = document.querySelector('.burger-menu');
    const body = document.querySelector('body');
    const header = document.querySelector('.header');

    const toggleMenu = function () {
        btnOpenBurgerMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
        body.classList.toggle('burger-active');
    }

    btnOpenBurgerMenu.addEventListener('click', toggleMenu);

    //уменьшить хедер при скроле 
    const scrollThreshold = 50; // Количество пикселей, при котором хедер будет уменьшаться
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('small');
        } else {
            header.classList.remove('small');
        }
    });

    //закрытие бургер меню при переходе на ссылку с меню
    const burgerMenuLinks = document.querySelectorAll('.burger-menu .menu a');
    burgerMenuLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (body.classList.contains('burger-active')) {
                btnOpenBurgerMenu.classList.remove('active');
                burgerMenu.classList.remove('active');
                body.classList.remove('burger-active')
            }
        });
    });

    //при нажатии кнопки переход к форме
    const mainBtns = document.querySelectorAll(".main-btn");
    const firstIput = document.querySelector("input[name=firstName]");

    mainBtns.forEach((e) => {
        e.addEventListener("click", function () {
            firstIput.focus();
        });
    })

    //Отправка формы
    const form = document.querySelector('#form');

    form.addEventListener('submit', formSend);

    async function formSend(e) {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        let error = formValidate(form);

        if (error === 0) {
            btn.disabled = true;
            form.classList.add('_sending');
            setTimeout(() => {
                form.classList.remove('_sending');
                btn.disabled = false;
                form.reset();
            }, 2000)
        }
    }

    function formValidate(form) {
        let error = 0;
        let formReq = document.querySelectorAll('input[type=text]');

        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);
            if (input.classList.contains('_email')) {
                if (emailTest(input)) {
                    formAddError(input);
                    error++;
                }
            } else {
                if (input.value.trim() === '') {
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }

    function formAddError(input) {
        input.parentElement.classList.add('_error');
        input.classList.add('_error');
    }
    
    function formRemoveError(input) {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error');
    }

    function emailTest(input) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
    }

    //Появление блоков анимация
    function createObserverAndAnimate(blocks, callback) {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.4,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    callback(entry.target, index);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        blocks.forEach((block) => {
            observer.observe(block);
        });
    }

    function animateBlock(block, index) {
        setTimeout(() => {
            block.classList.add('active');
        }, index * 300);
    }

    const audienceBlocks = document.querySelectorAll('.audience__item');
    const speakerBlocks = document.querySelectorAll('.speaker__row div');

    createObserverAndAnimate(audienceBlocks, animateBlock);
    createObserverAndAnimate(speakerBlocks, animateBlock);
});