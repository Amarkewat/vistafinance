const initSite = () => {
  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".main-nav");
  const productDropdown = document.querySelector(".nav-dropdown");
  const productDropdownButton = document.querySelector(".nav-dropdown-button");
  const loanTypeSelect = document.querySelector("#loanType");
  const quickLoanForm = document.querySelector("#quickLoanForm");
  const quickLoanStatus = document.querySelector("#quickLoanStatus");
  const contactForm = document.querySelector("#contactForm");
  const contactStatus = document.querySelector("#contactStatus");
  const emiInputs = {
    amount: document.querySelector("#loanAmount"),
    amountRange: document.querySelector("#loanAmountRange"),
    rate: document.querySelector("#interestRate"),
    rateRange: document.querySelector("#interestRateRange"),
    tenure: document.querySelector("#loanTenure"),
    tenureRange: document.querySelector("#loanTenureRange"),
    monthly: document.querySelector("#monthlyEmi"),
    principal: document.querySelector("#principalAmount"),
    interest: document.querySelector("#totalInterest"),
    total: document.querySelector("#totalPayment"),
  };

  if (window.lucide) {
    window.lucide.createIcons();
  }

  menuButton?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  productDropdownButton?.addEventListener("click", () => {
    const isOpen = productDropdown.classList.toggle("open");
    productDropdownButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      productDropdown?.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
      productDropdownButton?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll("[data-loan]").forEach((button) => {
    button.addEventListener("click", () => {
      const loanType = button.getAttribute("data-loan");
      if (loanTypeSelect && loanType) loanTypeSelect.value = loanType;
      document.querySelector("#quick-loan")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  document.querySelectorAll("[data-loan-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const loanType = link.getAttribute("data-loan-link");
      if (loanTypeSelect && loanType) loanTypeSelect.value = loanType;
    });
  });

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.max(0, Math.round(value)));

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const syncPair = (input, range) => {
    if (!input || !range) return;

    const sync = (source, target) => {
      const min = Number(source.min);
      const max = Number(source.max);
      const fallback = Number(source.value || source.defaultValue || min);
      const value = clamp(Number(source.value) || fallback, min, max);

      source.value = value;
      target.value = value;
      calculateEmi();
    };

    input.addEventListener("input", () => sync(input, range));
    range.addEventListener("input", () => sync(range, input));
  };

  const calculateEmi = () => {
    const amount = Number(emiInputs.amount?.value) || 0;
    const annualRate = Number(emiInputs.rate?.value) || 0;
    const years = Number(emiInputs.tenure?.value) || 0;
    const months = years * 12;
    const monthlyRate = annualRate / 12 / 100;
    const emi =
      monthlyRate > 0
        ? (amount * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1)
        : months > 0
          ? amount / months
          : 0;
    const totalPayment = emi * months;
    const totalInterest = totalPayment - amount;

    if (emiInputs.monthly) emiInputs.monthly.textContent = formatCurrency(emi);
    if (emiInputs.principal) emiInputs.principal.textContent = formatCurrency(amount);
    if (emiInputs.interest) emiInputs.interest.textContent = formatCurrency(totalInterest);
    if (emiInputs.total) emiInputs.total.textContent = formatCurrency(totalPayment);
  };

  syncPair(emiInputs.amount, emiInputs.amountRange);
  syncPair(emiInputs.rate, emiInputs.rateRange);
  syncPair(emiInputs.tenure, emiInputs.tenureRange);
  calculateEmi();

  quickLoanForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(quickLoanForm);
    const name = formData.get("name") || "there";
    const loanType = formData.get("loanType") || "loan";

    quickLoanStatus.textContent = `Thanks ${name}. Your ${loanType} request is ready for follow-up.`;
    quickLoanForm.reset();
  });

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get("name") || "there";

    contactStatus.textContent = `Thanks ${name}. Your message has been captured locally.`;
    contactForm.reset();
  });
};

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initSite);
} else {
  initSite();
}
