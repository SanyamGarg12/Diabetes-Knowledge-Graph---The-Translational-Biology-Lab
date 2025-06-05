import React from "react";
import "../styles.css";

const Contact = () => {
  return (
    <div className="contact-container">
      {/* Main two-column layout */}
      <div className="contact-two-column-layout">
        {/* Left Column: Map and Address */}
        <div className="contact-left-column">
          {/* Google Map */}
          <div className="map-container">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.795892320593!2d77.2706012752857!3d28.545854075712214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3e564daac1d%3A0x2c582e340e7bc556!2sIndraprastha%20Institute%20of%20Information%20Technology%20Delhi!5e0!3m2!1sen!2sin!4v1741952250993!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          {/* Address Section */}
          <div className="address">
            <h2>Address</h2>
            <p>
              Department of Computational Biology <br />
              Indraprastha Institute of Information Technology, Delhi <br />
              Okhla Industrial Estate, Phase III <br />
              New Delhi, Delhi 110020 <br />
            </p>
            <a
              href="https://maps.app.goo.gl/qT6cT3aMyRqf5Wqc8"
              target="_blank"
              rel="noopener noreferrer"
              className="show-map"
            >
              Show Map
            </a>
          </div>
        </div>

        {/* Right Column: Members */}
        <div className="contact-right-column">
          <div className="members">
            <h2>Members</h2>
            <div className="member-list">
              <div className="member-item">
                <strong>Jaspreet Kaur Dhanjal</strong><br />
                <strong>Email:</strong> <a href="mailto:jaspreet@iiitd.ac.in">jaspreet@iiitd.ac.in</a>
              </div>
              <div className="member-item">
                <strong>Samriddhi Gupta</strong><br />
                <strong>Email:</strong> <a href="mailto:samriddhig@gmail.com">samriddhig@gmail.com</a>
              </div>
              <div className="member-item">
                <strong>Siddharth Anand</strong><br />
                <strong>Email:</strong> <a href="mailto:siddharth21494@iiitd.ac.in.com">siddharth21494@iiitd.ac.in</a>
              </div>
              <div className="member-item">
                <strong>Vivek Anand</strong><br />
                <strong>Email:</strong> <a href="mailto:vivek21503@iiitd.ac.in">vivek21503@iiitd.ac.in</a>
              </div>
              <div className="member-item">
                <strong>Sanyam Garg (Developer and Designer)</strong><br />
                <strong>Email:</strong> <a href="mailto:sanyam22448@iiitd.ac.in">sanyam22448@iiitd.ac.in</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Translational Biology Laboratory Link */}
      <div className="translational-biology">
        <a
          href="https://dhanjal-lab.iiitd.edu.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="transbio-link"
        >
          Visit the website for The Translational Biology Laboratory
        </a>
      </div>
    </div>
  );
};

export default Contact;
