import Swal from "sweetalert2";

export const alert = {
  success(title: string, text?: string) {
    return Swal.fire({
      icon: "success",
      title: title || 'BERHASIL REGISTER',
      text: text || "",
      confirmButtonText: "OK",
      allowOutsideClick: false,

    });
  },

  error(title: string, text?: string) {
    return Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonText: "OK",
    });
  },

  confirm(title: string, text?: string) {
  return Swal.fire({
    icon: "warning",
    title: title || "Apakah anda yakin?",
    text,
    timer: 1000,
    showCancelButton: true,
    showLoaderOnConfirm: true,
    allowOutsideClick: false,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  });
  },


  loading(title = "Memproses...") {
    return Swal.fire({
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

 close() {
    Swal.close();
  },
};