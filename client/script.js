document.addEventListener('DOMContentLoaded', function() {
  const typingText = document.getElementById('typing-text');
  const cursor = document.querySelector('.cursor');
  const terminal = document.getElementById('terminal');
  const input = document.getElementById('commandInput');
  const output = document.getElementById('output');
  const reviewFormContainer = document.getElementById('reviewFormContainer');

  // Typing Effect
  const text = "WELCOME TO MY PORTFOLIO";
  let index = 0;

  function typeEffect() {
    if (index < text.length) {
      typingText.textContent += text.charAt(index);
      index++;
      setTimeout(typeEffect, 100);
    } else {
      cursor.style.display = 'none';
      setTimeout(() => {
        document.querySelector('.typing-container').style.display = 'none';
        terminal.style.display = 'block';
      }, 1000);
    }
  }

  typingText.textContent = "";
  typeEffect();

  // Commands
  const commands = {
    about: `
      > Hi, I'm <span class="highlight">Priyanshu Kumar Sinha</span>, a passionate Computer Science student currently pursuing my B.Tech from <span class="highlight">Black Diamond College of Engineering and Technology</span>. 
      My journey in technology has fueled my curiosity, especially in the fields of <span class="highlight">Cybersecurity</span> and <span class="highlight">Web Development</span>.

      > I have hands-on experience in <span class="highlight">HTML</span>, <span class="highlight">CSS</span>, <span class="highlight">Java</span>, <span class="highlight">JavaScript</span>, <span class="highlight">C</span>, and <span class="highlight">C++</span>, along with a growing proficiency in AI technologies like <span class="highlight">OpenAI</span>. 
      My expertise extends to <span class="highlight">Website Penetration Testing</span> and <span class="highlight">Bug Hunting</span>, where I enjoy identifying vulnerabilities and enhancing system security.

      > Beyond coding, I am deeply invested in exploring the dynamic world of cybersecurity, constantly seeking opportunities to strengthen my problem-solving skills. Whether it’s building interactive web applications or uncovering security flaws, I thrive on challenges that push the boundaries of my knowledge.

      > Looking ahead, I aspire to contribute to the tech industry by creating secure, user-friendly solutions. I believe that technology should empower and protect users, and I’m excited to play a part in making the digital world safer.

      > Feel free to connect with me if you'd like to collaborate or chat about <span class="highlight">web development</span>, <span class="highlight">cybersecurity</span>, or emerging <span class="highlight">AI innovations</span>!
    `,
    skills: "> HTML, CSS, JavaScript, C, C++, Java, Cyber Security, Data Analysis",
    projects: `
      > Projects:
      <ul>
        <li>
          <a href="https://priyanshusinha-a.github.io/home-page/" target="_blank">
            Home Page - Cybersecurity and Web Development Resources
          </a>
        </li>
        <li>
          <a href="https://github.com/Priyanshusinha-A/E-PlantShopping-website" target="_blank">
            E-Plant Shopping - React + Express E-commerce
          </a>
        </li>
        <li>
          <a href="https://github.com/Priyanshusinha-A/expressBookReviews" target="_blank">
            Express Book Reviews - Backend Book Management
          </a>
        </li>
      </ul>
    `,
    education: `
    > Education & Certifications
    - 🎓 <span class="highlight">B.Tech in Computer Science</span> - Ongoing
      <br>  Black Diamond College of Engineering and Technology<br/><br/>
    - 🏅 <span class="highlight">DCSC (Drop Certified Security Course)</span> - Completed in 2024<br/><br/>
    - 💻 <span class="highlight">ADCA (Advanced Diploma in Computer Applications) Hons</span> - Grade: Outstanding (2023)<br/><br/>
    - 🏫 <span class="highlight">12th in Science</span> - Bagwan Surya Narayan College, Deo (2022)<br/><br/>
    - 🏫 <span class="highlight">10th Standard</span> - Ganghar Public School (2020)<br/><br/>
  `,
    contact: `
      > Contact Me
      Email: <a href="mailto:priyanshusinhatt@gmail.com">priyanshusinhatt@gmail.com</a><br />
      LinkedIn: <a href="https://www.linkedin.com/in/priyanshu-kumar-6716642b6/" target="_blank">LinkedIn</a><br />
      GitHub: <a href="https://github.com/Priyanshusinha-A/" target="_blank">GitHub</a>
    `,
    clear: () => {
      output.innerHTML = ""; // Clear screen
      reviewFormContainer.style.display = 'none'; // Hide the review form if open
      addToTerminal("> Screen cleared. If you were in the review form, it has been closed.");
    },
    review: () => {
      reviewFormContainer.style.display = 'block'; // Show review form
      addToTerminal("> Review form opened. Please provide your feedback. Type 'clear' to exit without submitting.");
    }
  };

  // Command Input Handling
  input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const command = input.value.trim().toLowerCase();
      input.value = ''; // Clear input

      if (commands[command]) {
        if (typeof commands[command] === 'function') {
          commands[command]();
        } else {
          addToTerminal(`> ${command}`);
          addToTerminal(commands[command]);
        }
      } else {
        addToTerminal(`> Command not found: "${command}". Try: about, skills, projects, education, contact, review, clear`);
      }
    }
  });

  // Display Text in Terminal
  function addToTerminal(text) {
    const newLine = document.createElement('div');
    newLine.className = 'line';
    newLine.innerHTML = text;
    output.appendChild(newLine);
    output.scrollTop = output.scrollHeight; // Scroll to the bottom
  }

  // Handle Form Submission
  document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const experience = document.querySelector('input[name="experience"]:checked').value;
    const comment = document.getElementById('comment').value;

    // Send data to backend using Fetch API
    fetch('http://localhost:3000/send-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, experience, comment })
    })
    .then(response => response.json())
    .then(data => {
      addToTerminal(`> Thank you, ${name}! Your ${experience.toLowerCase()} feedback has been sent successfully.`);
      reviewFormContainer.style.display = 'none';
      e.target.reset(); // Clear the form
    })
    .catch(error => {
      console.error('Error:', error);
      addToTerminal("> Failed to send feedback. Please try again.");
    });
  });
});
