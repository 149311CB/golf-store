import React, { useEffect, useMemo, useState } from "react";
import { useFetch } from "./useFetch";

class Checkout {
  proccessing;
  error;
  success;

  constructor() {
    this.proccessing = false;
    this.error = null;
    this.success = false;
  }
  init = () => {
    const [proccessing, setProccessing] = useState(this.proccessing);
    const [error, setError] = useState(this.error);
    const [success, setSuccess] = useState(this.success);

    return;
  };
}
