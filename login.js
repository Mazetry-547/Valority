// Conexión a Supabase
const supabaseClient = window.supabase.createClient(
  'https://ryocaavhdfnlcywjejle.supabase.co', // url de tu proyecto
  'sb_publishable_44xNQ4UeBwEgr7HFTNi-Qw_BxXFJryJ' // clave pública de tu proyecto
);

// 👁 Mostrar/ocultar contraseña
function togglePassword(){
  const input = document.getElementById("loginPassword");
  input.type = input.type === "password" ? "text" : "password";
}

// 🔑 Iniciar sesión (valida email + contraseña con Supabase Auth)
async function iniciarSesion(){
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const btn = document.getElementById("btnSignIn");

  if(!email || !password){
    alert("Please enter your email and password");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Signing in...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if(error){
    console.error("Login error:", error);
    alert("Incorrect email or password");
    btn.disabled = false;
    btn.textContent = "Sign in";
    return;
  }

  const nombre = data.user.user_metadata?.Name || data.user.email;
  alert(`✅ Welcome back, ${nombre}!`);

  // 👉 Aquí puedes redirigir a donde quieras después de iniciar sesión, ej:
  window.location.href = "valority_prototype.html";
}

// 🔵 Iniciar sesión con Google
async function signInWithGoogle(){
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google'
  });

  if(error){
    console.error("Google sign-in error:", error);
    alert("Error: " + error.message);
  }
}

// 🟦 Iniciar sesión con Microsoft
async function signInWithMicrosoft(){
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'azure',
    options: { scopes: 'email' }
  });

  if(error){
    console.error("Microsoft sign-in error:", error);
    alert("Error: " + error.message);
  }
}
