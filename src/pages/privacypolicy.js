import React, { Component } from "react";
import logo from "../assets/logo.png";
import {PageView, initGA} from '../tracking';

class PrivacyPolicy extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    document.title = "AngelThump - Privacy Policy";
    initGA();
    PageView();
  }

  render() {
    return (
      <div>
        <div className="at-align-text-center">
          <a href="/">
            <img alt="" src={logo} />
          </a>
          <h1 className="title">Privacy Policy</h1>
        </div>
        <h3 className="text">
          Welcome to the AngelThump.com. ("AngelThump.com") applications,
          platform, website({" "}
          <a href="http://angelthump.com" rel="nofollow noopener noreferrer" target="_blank">
            www.AngelThump.com
          </a>
          ), and any other web sites, applications, or services operated or
          produced by AngelThump.com (collectively, the "AngelThump.com
          Platform"). AngelThump.com values the privacy of the users,
          subscribers, publishers, members, and others who visit and use the
          AngelThump.com Platform (collectively or individually, "You" or
          "Users").
          <br />
          <br />
          By using the AngelThump.com Platform, you expressly consent to the
          information handling practices described in this policy. <br />
          <br />
          This Privacy Policy is incorporated into and is subject to the
          AngelThump.com Platform{" "}
          <a href="/tos" rel="nofollow noopener noreferrer" target="_blank">
            Terms of Service
          </a>
          . Your use of the AngelThump.com Platform and any personal information
          you provide through the AngelThump.com Platform are subject at all
          time to this Privacy Policy and the
          <a href="/tos" rel="nofollow noopener noreferrer" target="_blank">
            Terms of Service
          </a>
          .<br />
        </h3>
        <h2 className="subtitle">The Information AngelThump.com Collects</h2>
        <h3 className="text">
          <ul>
            <li className="list">
              User-provided Information: You may provide to AngelThump.com what
              is generally called "personally identifiable" information (such as
              your name, email address, postal mailing address, home/mobile
              telephone number, credit card number and billing information) if
              you upload, purchase, or view or download certain content or
              products from the AngelThump.com Platform, enter contests or
              sweepstakes, or otherwise use the features and functionality of
              the AngelThump.com Platform.
            </li>
            <li className="list">
              "Cookies" Information: When you access the AngelThump.com
              Platform, we may send one or more cookies - small text files
              containing a string of alphanumeric characters - to your computer.
              AngelThump.com may use both session cookies and persistent
              cookies. A session cookie disappears after you close your browser.
              A persistent cookie remains after you close your browser and may
              be used by your browser on subsequent visits to the AngelThump.com
              Platform. Persistent cookies can be removed. Please review your
              web browser "Help" file to learn the proper way to modify your
              cookie settings.
            </li>
            <li className="list">
              "Automatically Collected" Information: When you access the
              AngelThump.com Platform or open one of our HTML emails, we may
              automatically record certain information from your system by using
              different types of tracking technology. This "automatically
              collected" information may include Internet Protocol address ("IP
              Address"), a unique user ID, version of software installed, system
              type, the content and pages that you access on the AngelThump.com
              Platform, and the dates and times that you visit the
              AngelThump.com Platform.
            </li>
          </ul>
        </h3>
        <h2 className="subtitle">The Way AngelThump.com Uses Information</h2>
        <h3 className="text">
          <ul>
            <li className="list">
              AngelThump.com uses the information that you provide or that we
              collect to operate, maintain, enhance, and provide all of the
              features and services found on the AngelThump.com Platform as well
              as to track user-generated content and Users to the extent
              necessary to comply as a service provider with the Digital
              Millennium Copyright Act.
            </li>
            <li className="list">
              We will use your email address, without further consent, for
              administrative communications such as notifying you of major
              AngelThump.com Platform updates, for customer service purposes, to
              address copyright infringement or defamation issues, or to contact
              you regarding any content that you have posted to or downloaded
              from the AngelThump.com Platform.
            </li>
            <li className="list">
              AngelThump.com uses all of the information that we collect to
              understand the usage trends and preferences of our Users, to
              improve the way the AngelThump.com Platform works and looks, and
              to create new features and functionality.
            </li>
            <li className="list">
              AngelThump.com may use "Automatically Collected" information and
              "Cookies" information to: (a) automatically update the
              AngelThump.com application on your system; (b) remember your
              information so that you will not have to re-enter it during your
              visit or the next time you access the AngelThump.com Platform; (c)
              provide customized third-party advertisements, content and
              information; (d) monitor the effectiveness of third-party
              marketing campaigns; (e) monitor aggregate site usage metrics such
              as total number of visitors and pages accessed; and (f) track your
              entries, submissions, and status in any promotions or other
              activities.
            </li>
          </ul>
        </h3>
        <h2 className="subtitle">When AngelThump.com Discloses Information</h2>
        <h3 className="text">
          <ul>
            <li className="list">
              AngelThump.com does not share your personally identifiable
              information with other organizations for their marketing or
              promotional uses without your prior express consent. Please be
              aware, however, that any personally identifiable information that
              you voluntarily choose to display on any publicly available
              portion of the AngelThump.com Platform - such as when you publish
              content, comments or profile information - becomes publicly
              available and may be collected and used by others without
              restriction.
            </li>
            <li className="list">
              AngelThump.com may disclose Automatically Collected and other
              aggregate non-personally-identifiable information with interested
              third parties to assist such parties in understanding the usage
              and demographic patterns for certain programs, content, services,
              advertisements, promotions, or other functionality of
              AngelThump.com.
            </li>
            <li className="list">
              We may disclose some limited User information to affiliated
              companies or other businesses or persons to: provide web site
              hosting, maintenance, and security services; fulfill orders;
              conduct data analysis and create reports; offer certain
              functionality; and assist AngelThump.com in improving the
              AngelThump.com Platform and creating new services features. We
              require that these parties process such information in compliance
              with this Privacy Policy, we authorize only a limited use of such
              information, and we require these parties to use reasonable
              confidentiality measures.
            </li>
            <li className="list">
              AngelThump.com may disclose User information if required to do so
              by law or in the good-faith belief that such action is necessary
              to comply with state and federal laws (such as U.S. Copyright law)
              or respond to a court order, judicial or other government
              subpoena, or warrant in the manner required by the requesting
              entity.
            </li>
            <li className="list">
              AngelThump.com also reserves the right to disclose User
              information that we believe, in good faith, is appropriate or
              necessary to take precautions against liability; protect
              AngelThump.com from fraudulent, abusive, or unlawful uses; to
              investigate and defend ourselves against third-party claims or
              allegations; to assist government enforcement agencies; to protect
              the security or integrity of the AngelThump.com Platform; or to
              protect the rights, property, or personal safety of
              AngelThump.com, our Users, or others.
            </li>
          </ul>
        </h3>
        <h2 className="subtitle">Your Choices</h2>
        <h3 className="text">
          You may, of course, decline to share your personally-identifiable
          information with AngelThump.com, in which case AngelThump.com will not
          be able to provide to you some of the features and functionality found
          on the AngelThump.com Platform. You may update, correct, or delete
          your user information and preferences by clicking on the "Edit
          Settings" link on the top left of the page once you have logged in to
          the AngelThump.com Platform. <br />
          <br />
          To protect your privacy and security, we take reasonable steps to
          verify your identity before granting you account access or making
          corrections to your information. You are responsible for maintaining
          the secrecy of your unique password and account information at all
          times.
        </h3>
        <h2 className="subtitle">Advertisers</h2>
        <h3 className="text">
          AngelThump.com may allow advertisers, third party advertising networks
          and third-party advertising serving companies to serve advertisements
          directly to you within the AngelThump.com site, services and software.
          By serving these advertisements directly to you, these companies can
          set their own cookies on your computer and trigger their own Web
          beacons to measure the effectiveness of their advertisements and to
          personalize the advertising content. AngelThump.com does not provide
          your personally identifiable information to these third-party ad
          servers or ad networks without your consent. However, please note that
          if an advertiser asks AngelThump.com to show an advertisement to a
          certain audience (for example, males age 15 to 18) or audience segment
          (for example, males age 15 to 18 who have participated in certain
          promotions) and you respond to that advertisement, the advertiser or
          ad-server may conclude that you fit the description of the audience
          that they were trying to reach. You should consult the respective
          privacy policies of these third-party ad servers or ad networks.{" "}
          <br />
          <br />
          Some of these companies are participants in the Network Advertising
          Initiative ("NAI"), a cooperative of online marketing and analytic
          companies committed to building consumer awareness and establishing
          responsible business and data management practices and standards. You
          can learn more about NAI and how you may "opt out" of targeted
          advertising delivered by NAI member ad networks here:
          <br />
          <br />
          <a
            href="http://www.networkadvertising.org/"
            rel="nofollow noopener noreferrer"
            target="_blank"
          >
            http://www.networkadvertising.org/
          </a>{" "}
          <br />
          <br />
          This Privacy Policy does not apply to, and we cannot control the
          activities of, such other advertisers or web sites. AngelThump.com
          reserves the right the add or remove third-party ad networks or ad
          servers in its discretion and AngelThump.com may not at all times list
          such updated ad network or ad server partners in this Privacy Policy.
        </h3>
        <h2 className="subtitle">Our Commitment to Data Security</h2>
        <h3 className="text">
          AngelThump.com uses commercially reasonable physical, managerial, and
          technical safeguards to preserve the integrity and security of your
          personal information. We cannot, however, ensure or warrant the
          security of any information you transmit to AngelThump.com, and you do
          so at your own risk. Once we receive your transmission of information,
          AngelThump.com makes commercially reasonable efforts to ensure the
          security of our systems. However, please note that this is not a
          guarantee that such information may not be accessed, disclosed,
          altered, or destroyed by breach of any of our physical, technical, or
          managerial safeguards. <br /> <br />
          If AngelThump.com learns of a security systems breach, then we may
          attempt to notify you electronically so that you can take appropriate
          protective steps. AngelThump.com may post a notice on the
          AngelThump.com Platform if a security breach occurs. Depending on
          where you live, you may have a legal right to receive notice of a
          security breach in writing. To receive a free written notice of a
          security breach you should notify us at admin@AngelThump.com
        </h3>
        <h2 className="subtitle">Our Commitment to Children's Privacy</h2>
        <h3 className="text">
          If you are under 13 years of age, then please do not use or access THE
          AngelThump.com PLATFORM at any time or in any manner. <br />
          <br />
          Protecting the privacy of young children is especially important. For
          that reason, AngelThump.com does not knowingly collect or maintain
          personally identifiable information from persons under 13
          years-of-age. If AngelThump.com learns that personally-identifiable
          information of persons less than 13-years-of-age has been collected on
          or through the AngelThump.com Platform, then AngelThump.com will take
          the appropriate steps to delete this information. <br />
          <br />
          If you are the parent or legal guardian of a child under 13 who has
          become AngelThump.com Platform member, then please contact
          AngelThump.com at admin@AngelThump.com <br />
          <br />
          The following are some resources that may help parents and legal
          guardians in monitoring and limiting your childrens' access to certain
          types of material on the Internet. While AngelThump.com does not
          endorse these products, we provide information about them as a public
          service to our community.
          <ul>
            <li>
              <a
                href="http://onguardonline.gov/socialnetworking.html"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                "OnGuard Online," maintained by the FTC.
              </a>
            </li>
            <li>
              <a
                href="http://www.wiredsafety.org"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                WiredSafety
              </a>
            </li>
            <li>
              <a href="http://www.netsmartz.org" rel="nofollow noopener noreferrer" target="_blank">
                Netsmartz.org
              </a>
            </li>
            <li>
              <a
                href="http://www.csn.org/index.jsp"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                The Child Safety Network
              </a>
            </li>
            <li>
              <a
                href="http://www.controlkids.com"
                rel="nofollow noopener noreferrer"
                target="_blank"
              >
                Control Kids
              </a>
            </li>
            <li>
              <a href="http://www.solidoak.com" rel="nofollow noopener noreferrer" target="_blank">
                Cyber Sitter
              </a>
            </li>
            <li>
              <a href="http://www.netnanny.com" rel="nofollow noopener noreferrer" target="_blank">
                Net Nanny
              </a>
            </li>
          </ul>
        </h3>
        <h2 className="subtitle">International Visitors</h2>
        <h3 className="text">
          For Users visiting the AngelThump.com Platform from the European
          Economic Area or other non-U.S. territories, please note that any data
          you enter into the AngelThump.com Platform will be transferred outside
          the European Economic Area or such other non-U.S. territory for use by
          AngelThump.com and its affiliates for any of the purposes described
          herein. In addition, because AngelThump.com operates globally, we may
          make information we gather available to worldwide business units and
          affiliates. By providing any data on the AngelThump.com Platform, you
          hereby expressly consent to such transfers of your data to the United
          States or other countries.
        </h3>
        <h2 className="subtitle">In the Event of Merger or Sale</h2>
        <h3 className="text">
          In the event that AngelThump.com is acquired by or merged with a
          third-party entity, we reserve the right, in any of these
          circumstances, to transfer or assign the information that we have
          collected from Users as part of that merger, acquisition, sale, or
          other change of control. <br />
          <br />
          This Privacy Policy may be revised periodically without further policy
          to you and this will be reflected by a "last modified" date below.
          Please revisit this page to stay aware of any changes. In general, we
          only use your personal information in the manner described in the
          Privacy Policy in effect when we received that personal information.
          Your continued use of the AngelThump.com Platform constitutes your
          agreement to this Privacy Policy and any future revisions. <br />
          <br />
          For revisions to this Privacy Policy that may be materially less
          restrictive on our use or disclosure of personal information you have
          provided to us, we will make reasonable efforts to notify you and
          obtain your consent before implementing revisions with respect to such
          information.
        </h3>
      </div>
    );
  }
}

export default PrivacyPolicy;
