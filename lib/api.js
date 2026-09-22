import axios from 'axios';

/**
 * NOTE: This is a portfolio/showcase build of SalesScout.
 * The production API client (interceptors, CSRF handling, auth-refresh
 * retry queue, and endpoint logic) has been withheld and is not included
 * in this repository. This file is a non-functional stub kept only so
 * the surrounding UI components remain readable.
 */

export function setCsrfToken() {}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000',
  withCredentials: true,
});

export default api;
