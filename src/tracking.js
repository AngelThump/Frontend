import ReactGA from "react-ga";

const trackingID = "UA-98637299-1";

export const initGA = () => {
    ReactGA.initialize(trackingID);
}

export const PageView = () => {
    ReactGA.pageview(window.location.pathname +  
                     window.location.search); 
}

/**
 * Event - Add custom tracking event.
 * @param {string} category 
 * @param {string} action 
 * @param {string} label 
 */
export const Event = (category, action, label) => {
    ReactGA.event({
      category: category,
      action: action,
      label: label
    });
};