// Conexión a Supabase
const supabaseClient = window.supabase.createClient(
  'https://ryocaavhdfnlcywjejle.supabase.co', // url de tu proyecto
  'sb_publishable_44xNQ4UeBwEgr7HFTNi-Qw_BxXFJryJ' // clave pública de tu proyecto
);

const TABLA = 'Prueba'; // 👈 usa SIEMPRE el mismo nombre exacto que tu tabla en Supabase

// 🚀 Crear cuenta (Sign Up)
async function crearCuenta(){
  const nombre = document.getElementById("nombre").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const edad = document.getElementById("edad").value;
  const terminos = document.getElementById("terminos").checked;
  const btn = document.getElementById("btnCrearCuenta");

  if(!nombre || !username || !email || !password || !confirmPassword || !edad){
    alert("Please fill in all fields");
    return;
  }

  if(password !== confirmPassword){
    alert("Passwords do not match");
    return;
  }

  if(password.length < 6){
    alert("Password must be at least 6 characters long");
    return;
  }

  if(!terminos){
    alert("You must accept the Terms & Conditions");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Creating account...";

  // 🔐 Crear la cuenta en Supabase Auth (la contraseña queda encriptada, nunca en texto plano)
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { Name: nombre, Username: username, Age: edad } }
  });

  if(error){
    console.error("Error al registrar:", error);
    alert("Error: " + error.message);
    btn.disabled = false;
    btn.textContent = "Create Account";
    return;
  }

  // Guardamos los datos públicos en la tabla (la contraseña NO se guarda aquí)
  const { error: errorTabla } = await supabaseClient
    .from(TABLA)
    .insert([{ Name: nombre, Email: email, Username: username, Age: edad }]); // 👈 ajusta nombres si tus columnas son distintas

  if(errorTabla){
    console.error("Error al guardar en la tabla:", errorTabla);
  }

  alert("✅ Account created! Welcome to Valority.");

  document.getElementById("nombre").value = "";
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirmPassword").value = "";
  document.getElementById("edad").value = "";
  document.getElementById("terminos").checked = false;

  btn.disabled = false;
  btn.textContent = "Create Account";
}

// 🔵 Iniciar sesión / registrarse con Google
async function signInWithGoogle(){
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google'
  });

  if(error){
    console.error("Error con Google:", error);
    alert("Error: " + error.message);
  }
  // Si todo está bien configurado, el navegador te redirige solo a Google
}

// 🟦 Iniciar sesión / registrarse con Microsoft
async function signInWithMicrosoft(){
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email' // Microsoft requiere este scope para devolver el email
    }
  });

  if(error){
    console.error("Error con Microsoft:", error);
    alert("Error: " + error.message);
  }
}
