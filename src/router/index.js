import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase/init';

/**
 * Comprueba si el usuario actual está autenticado.
 *
 * @async
 * @function
 * @returns {Promise<boolean>} Devuelve true si el usuario está autenticado, de lo contrario, false.
 */
const isAuthenticated = async () => {
  const user =  auth.currentUser;
  return !!user;
};

// Definición de rutas
const routes = [
  {
    path: '/aihome',
    name: 'HomeView',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/aihome/login',
    name: 'Login',
    component: () => import('../views/Auth/LoginView.vue')
  },
  {
    path: '/aihome/register',
    name: 'Register',
    component: () => import('../views/Auth/RegisterView.vue')
  },
  {
    path: '/aihome/dashboard',
    name: 'DashboardView',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true } // Meta-información para indicar que la ruta requiere autenticación
  },
  {
    path: '/aihome/Perfil',
    name: 'PerfilUser',
    component: () => import('../views/PerfilUser.vue'),
    meta: { requiresAuth: true } // Meta-información para indicar que la ruta requiere autenticación
  },
  {
    path: '/aihome/espacio/:id',
    name: 'Espacio',
    component: () => import('../components/EspasiosView.vue'),
    meta: { requiresAuth: true } // Meta-información para indicar que la ruta requiere autenticación
  },
  
  
];

// Creación del enrutador
const router = createRouter({
  history: createWebHistory(),
  routes
});

//Verificar la autenticación antes de acceder a rutas protegidas
router.beforeEach(async (to, from, next) => {
  const isAuthenticatedUser = await isAuthenticated();

  if (isAuthenticatedUser) {
    // Si el usuario está autenticado y trata de acceder a las rutas de login o registro
    if (to.name === 'Login' || to.name === 'Register') {
      // Redirigir al usuario a la página de inicio (o a otra ruta que desees)
      next({ name: 'HomeView' });
    } else {
      // Si el usuario está autenticado y no está tratando de acceder a las rutas de login o registro, permitir el acceso
      next();
    }
  } else {
    // Si el usuario no está autenticado, permitir el acceso solo a rutas que no requieran autenticación
    if (to.matched.some(({ meta }) => meta.requiresAuth)) {
      // Si la ruta protegida requiere autenticación y el usuario no está autenticado, redirigir al componente de inicio de sesión
      next({ name: 'Login' });
    } else {
      // Si la ruta no requiere autenticación, permitir el acceso
      next();
    }
  }
});
export default router;
