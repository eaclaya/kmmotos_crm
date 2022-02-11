export default function auth({ next, router }) {
  if (!localStorage.getItem('employee_id')) {
    return router.push({ name: 'Login' });
  }

  return next();
}