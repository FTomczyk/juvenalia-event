document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {

    const currentTitle = document.title;
    const form = document.querySelector('section#contact form');
    if (currentTitle.includes("Juwenalia Politechniki Łódzkiej 2025")) {
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                const formData = new FormData(this);
                const data = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    subject: formData.get('subject'),
                    message: formData.get('message')
                };

                fetch('submit_contact.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(result => {
                    alert(result.message);
                    if (result.success) {
                        this.reset();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Wystąpił błąd komunikacji z serwerem.');
                });
            });
        }
    }
    if (currentTitle.includes("Juwenalia PŁ - Wolontariat")) {
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(this);
                const data = {
                    name: formData.get('name'),
                    student_id: formData.get('student-id'),
                    email: formData.get('email')
                };

                fetch('register_volunteer.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(result => {
                    alert(result.message);
                    if (result.success) {
                        this.reset();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Wystąpił błąd komunikacji z serwerem.');
                });
            });
        }
    }

    const openModalButton = document.getElementById('open-ticket-modal');
    const closeModalButton = document.getElementById('close-ticket-modal');
    const modalOverlay = document.getElementById('ticket-modal-overlay');
    const ticketForm = document.getElementById('ticket-form');

    if (ticketForm) {
        const studentIdInput = document.getElementById('ticket-student-id');
        const studentTicketRadio = document.querySelector('input[value="student"]');
        const studentTicketOption = document.getElementById('student-ticket-option');

        const openModal = () => {
            modalOverlay.classList.add('is-visible');
            document.body.style.overflow = 'hidden';
            ticketForm.reset();
            validateStudentId();
        };

        const closeModal = () => {
            modalOverlay.classList.remove('is-visible');
            document.body.style.overflow = '';
        };

        const validateStudentId = () => {
            if (!studentIdInput) return;
            const studentId = studentIdInput.value.trim();
            const isValid = /^\d{6}$/.test(studentId);
            if (isValid) {
                studentTicketRadio.disabled = false;
                studentTicketOption.classList.remove('disabled-option');
                studentTicketOption.querySelector('.ticket-info').textContent = '(wymagana ważna legitymacja przy wejściu)';
            } else {
                studentTicketRadio.disabled = true;
                studentTicketOption.classList.add('disabled-option');
                studentTicketOption.querySelector('.ticket-info').textContent = '(wymagany poprawny 6-cyfrowy numer indeksu)';
                if (studentTicketRadio.checked) {
                    document.querySelector('input[value="standard"]').checked = true;
                }
            }
        };

        if(studentIdInput) studentIdInput.addEventListener('input', validateStudentId);
        if(openModalButton) openModalButton.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
        if(closeModalButton) closeModalButton.addEventListener('click', closeModal);
        if(modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('is-visible')) closeModal(); });

        ticketForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(ticketForm);
            
            const ticketType = formData.get('ticket_type');
            const studentId = formData.get('student_id');

            if (ticketType === 'student' && !/^\d{6}$/.test(studentId)) {
                alert('Aby kupić bilet studencki, musisz podać poprawny 6-cyfrowy numer indeksu');
                studentIdInput.focus();
                return;
            }

            const ticketData = {
                firstName: formData.get('first_name'),
                lastName: formData.get('last_name'),
                studentId: studentId,
                email: formData.get('email'),
                ticketType: ticketType,
                quantity: formData.get('quantity'),
            };

            fetch('buy_ticket.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData)
            })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
                if(result.success) {
                    closeModal();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Wystąpił błąd komunikacji z serwerem.');
            });
        });
        if(studentIdInput) validateStudentId();
    }
    const track = document.querySelector('.image-carousel-track');
    if (track) {
        const imagesInTrack = track.querySelectorAll('.carousel-image');
        if (imagesInTrack.length > 0) {
            const originalImageCount = 9;
            const scrollIntervalTime = 4000;
            const transitionDuration = 800;
            let currentIndex = 0;
            let imageItemWidth = imagesInTrack[0].offsetWidth;

            const updateImageWidth = () => { if (imagesInTrack.length > 0) imageItemWidth = imagesInTrack[0].offsetWidth; };

            const scrollCarousel = () => {
                currentIndex++;
                track.style.transform = `translateX(-${currentIndex * imageItemWidth}px)`;
                if (currentIndex >= originalImageCount) {
                    setTimeout(() => {
                        track.style.transition = 'none';
                        currentIndex = 0;
                        track.style.transform = `translateX(0px)`;
                        setTimeout(() => {
                            track.style.transition = `transform ${transitionDuration / 1000}s ease-in-out`;
                        }, 50);
                    }, transitionDuration);
                }
            };
            if (imagesInTrack.length > 1) {
                updateImageWidth();
                setInterval(scrollCarousel, scrollIntervalTime);
                window.addEventListener('resize', updateImageWidth);
            }
        }
    }

    if (document.getElementById('countdown-timer')) {
        const updateCountdown = () => {
            const endDate = new Date('2025-05-30T18:00:00');
            const now = new Date();
            const diff = endDate - now;

            if (diff <= 0) {
                document.getElementById('countdown-timer').innerHTML = '<span>00</span>d : <span>00</span>h : <span>00</span>m : <span>00</span>s';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
});