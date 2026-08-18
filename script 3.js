// Conexión a Supabase
const supabaseClient = window.supabase.createClient(
  'https://ryocaavhdfnlcywjejle.supabase.co', // url de tu proyecto
  'sb_publishable_44xNQ4UeBwEgr7HFTNi-Qw_BxXFJryJ' // clave pública de tu proyecto
);

const TABLA = 'Prueba'; //  usa SIEMPRE el mismo nombre exacto que tu tabla en Supabase

//  Registrar usuario (crea cuenta segura con Supabase Auth)
async function guardarUsuario(){
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if(!nombre || !email || !password){
    alert("Completa nombre, email y contraseña");
    return;
  }

  if(password.length < 6){
    alert("La contraseña debe tener al menos 6 caracteres");
    return;
  }

  //  Crear la cuenta en Supabase Auth (la contraseña queda encriptada, nunca en texto plano)
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { Name: nombre } }
  });

  if(error){
    console.error("Error al registrar:", error);
    alert("Error: " + error.message);
    return;
  }

  // Guardamos Nombre, Email y Contraseña también en la tabla, para que siga apareciendo en la lista
  // ⚠️ SOLO PARA PRUEBAS: la contraseña queda en texto plano en esta tabla.
  const { error: errorTabla } = await supabaseClient
    .from(TABLA)
    .insert([{ Name: nombre, Email: email, Password: password }]); // 👈 ajusta "Password" si tu columna tiene otro nombre/mayúsculas

  if(errorTabla){
    console.error("Error al guardar en la lista:", errorTabla);
  }

  alert("✅ Cuenta creada correctamente. Si tu proyecto requiere confirmación, revisa tu correo.");
  document.getElementById("nombre").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  cargarUsuarios();
}

// 📥 Cargar usuarios
async function cargarUsuarios(){
  const { data, error } = await supabaseClient
    .from(TABLA)
    .select('*');

  if(error){
    console.error("Error al cargar:", error);
    return;
  }

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  data.forEach(user => {
    lista.innerHTML += `<li class="list-group-item">${user.Name} — ${user.Email} — ${user.Password}</li>`;
  });
}

// 🔑 Iniciar sesión (valida email + contraseña con Supabase Auth)
async function iniciarSesion(){
  const email = document.getElementById("emailLogin").value.trim();
  const password = document.getElementById("passwordLogin").value;
  const bienvenida = document.getElementById("bienvenida");

  if(!email || !password){
    alert("Escribe email y contraseña");
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if(error){
    console.error("Error al iniciar sesión:", error);
    bienvenida.classList.add("d-none");
    alert("❌ Email o contraseña incorrectos");
    return;
  }

  const nombre = data.user.user_metadata?.Name || data.user.email;
  bienvenida.textContent = `✅ ¡Bienvenido, ${nombre}!`;
  bienvenida.classList.remove("d-none");
}

// Cargar la lista en cuanto se abre la página
cargarUsuarios();
