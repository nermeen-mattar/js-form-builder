class Stepper {
    constructor(stepperElement) {
      this.stepperElement = stepperElement;
      this.events = {
        stepChanged: [],
        completed: []
      };
      this.stepsContainer = stepperElement.querySelector(".steps");
      this.steps = [...this.stepsContainer.querySelectorAll(".step")].map((step, index) => {
        return new Step(step, index, this);
      });
      this.buttons = stepperElement.querySelector(".buttons");
      this.next = new NextButton(this.buttons.querySelector(".step-next"), this);
      this.back = new BackButton(this.buttons.querySelector(".step-back"), this);
      this.finish = new FinishButton(this.buttons.querySelector(".step-finish"), this);
      this.setActiveStep(0);
    }
  
    nextStep() {
      this.setActiveStep(this.activeIndex + 1);
    }
  
    previousStep() {
      this.setActiveStep(this.activeIndex - 1);
    }
  
    // Add event listners to event object.
    listenForEvent(eventName, callback) {
      this.events[eventName].push(callback);
    }
  
    // @returns {boolean} True if all steps are complete.
    get isComplete() {
      return this.steps.filter(step => step.isComplete).length === this.steps.length;
    }
  
    // Runs all callbacks under the specified event key.
    emmitEvent(eventName) {
      this.events[eventName].forEach(callback => {
        callback(this);
      });
    }
  
    /**
     * This is the main function for setting the active step. This also emmits all
     * Event listners for children classes.
     */
    setActiveStep = index => {
      
      // Only run if actually changing the current step.
      if(Math.abs(this.activeIndex - index) > 1 || this.activeIndex == index) {
          return;
      }

      const btnNext = $('.step-next');
      if(index==1) {

        // emit event and listen form checkout and do following
        const loading = btnNext.find('#loading').removeClass('d-none');
        setTimeout(() => 
      {
        btnNext.find('.button-text').html('Checkout');

        loading.addClass('d-none');

        this.changeStep(1);
      }, 300);
        return;
      }
      btnNext.find('.button-text').html('Next');

      this.changeStep(index);

    };

    changeStep = index => {
      if (this.activeIndex !== index) {
        $('.step-content').removeClass('d-block').addClass('d-none');
          $('.step-content').eq(index).removeClass('d-none').addClass('d-block');
        // Change to specific index only if within steps range.
        if (index > -1 && index < this.steps.length) {
          this.activeIndex = index;
          // If not in range then default to first step.
        } else {
          this.activeIndex = 0;
        }
        this.emmitEvent("stepChanged");
        if (this.isComplete) {this.emmitEvent("completed"); alert('when?')}
      }
      if(index === 2) {
        this.emmitEvent("completed");
        window.dispatchEvent(new CustomEvent('checkout'));
        $(".step:not('.active')").replaceWith(function() {
            return $("<span class='step'>" + $(this).html() + "</span>");
        });
      }
    }
  }
  
  /**
   * Each step get's it's own logic and functionality. This will listen for
   * changes made to the current active step.
   *
   * It will update it's UI when it is: focused, blured, or completed.
   *
   * On init and reset() it set's its icon element to it's proper index.
   *
   * @author Robert Todar <robert@roberttodar.com>
   */
  class Step {
    constructor(step, index, stepper) {
      this.step = step;
      this.index = index;
      this.stepper = stepper;
      this.icon = step.querySelector(".icon");
      this.isComplete = false;
      this.isActive = false;
      stepper.listenForEvent("stepChanged", this.stepChanged);
      this.mouseEvent = this.step.addEventListener("mouseup", () => {
        this.stepper.setActiveStep(this.index);
      });
      this.reset();
    }
  
    // Event - sees if UI should be updated from getting or loosing focus.
    stepChanged = ({ activeIndex }) => {
      if (activeIndex === this.index) {
        this.setFocus();
      } else {
        this.looseFocus();
      }
    };
  
    setFocus() {
      if (!this.isActive) {
        this.step.classList.add("active");
        this.isActive = true;
      }
    }
  
    looseFocus() {
      if (this.isActive) {
        this.step.classList.remove("active");
        this.isActive = false;
      }
    }
  
    complete() {
      this.isComplete = true;
      this.icon.innerHTML = '<i class="material-icons">done</i>';
    }
  
    reset() {
      this.isComplete = false;
      this.icon.innerHTML = this.index + 1;
    }
  }
  
  /**
   * This is a generic Button class meant to be extended to all the other
   * buttons.
   *
   * It really just updates the UI from being disabled|enabled and displayed.
   *
   * @note I can't figure out how to have this.stepper.listenForEvent("stepChanged", this.stepChanged);
   *  within this class??
   */
  class Button {
    constructor(el, stepper) {
      this.stepper = stepper;
      this.el = el;
      this.el.addEventListener("click", this.mouseup);
    }
  
    disable() {
      this.el.disabled = true;
    }
  
    enable() {
      this.el.disabled = false;
    }
  
    hide() {
      this.el.style.display = "none";
    }
  
    show() {
      this.el.style.display = "inline-block";
    }
  }
  
  /**
   * Next button moves the active step forward.
   * It is disabled if at the end of the steps.
   */
  class NextButton extends Button {
    constructor(el, stepper) {
      super(el, stepper);
      this.stepper.listenForEvent("stepChanged", this.stepChanged);
    }
  
    mouseup() {
      const { setActiveStep, activeIndex } = stepper;
      setActiveStep(activeIndex + 1);
    }
  
    stepChanged = ({ activeIndex, steps }) => {
      if (activeIndex === steps.length - 1) this.disable();
      if (activeIndex < steps.length - 1) this.enable();
    };
  }
  
  /**
   * Back button moves the active step backward.
   * It is disabled if at the start of the steps.
   */
  class BackButton extends Button {
    constructor(el, stepper) {
      super(el, stepper);
      this.stepper.listenForEvent("stepChanged", this.stepChanged);
    }
  
    mouseup() {
      const { setActiveStep, activeIndex } = stepper;
      setActiveStep(activeIndex - 1);
    }
  
    stepChanged = ({ activeIndex }) => {
      if (activeIndex === 0) this.disable();
      if (activeIndex > 0) this.enable();
    };
  }
  
  
  /**
   * Finish button currently just resets everything back to normal.
   * It is hidden by default and shown once all steps are complete.
   */
  class FinishButton extends Button {
    constructor(el, stepper) {
      super(el, stepper);
      this.stepper.listenForEvent("completed", this.completed);
    }
  
    mouseup() {
      const { setActiveStep, steps, complete, finish } = stepper;
      steps.forEach(step => {
        step.reset();
      });
      finish.hide();
      complete.show();
      complete.enable();
      setActiveStep(0);
    }
  
    completed = () => {
      this.show();
      this.el.focus();
    };
  }
  // https://codepen.io/todar/pen/pQxLZo
  
  // Initialize the stepper.
  const el = document.querySelector(".stepper");
  export const stepper = new Stepper(el);