import toast from "react-hot-toast";

export const toastSuccess = (text: string) => {
    toast.success(
    <div>
        {text}
    </div>, {
      position: 'bottom-right',
      duration: 3000,
      style:{
        backgroundColor:'#F6FFED',
        width:'395px',
        padding: '9px 16px',
        fontSize:'14px',

    }
    });
  };
  
  export const toastError = (text: string) => {
    toast.error(
      (t) => (
        <div>
            {text}
        </div>
      ),
      {
        position: 'bottom-right',
        duration: 3000,
        style:{
            backgroundColor:'#FFCCC7',
            width:'395px',
            padding: '9px 16px'
        }

      },
    );
  };