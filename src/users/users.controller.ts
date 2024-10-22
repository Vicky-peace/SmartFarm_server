import { Context } from "hono";
import { getUserService, listUserService,updateUserService,deleteUserService } from "./users.services";
 
export const listUsersController = async(c: Context) => {
    try {
        const limit = Number(c.req.query('limit'))
        const data = await listUserService(limit)
        if(data == null || data.length ==0){
            return c.json({message: 'User not found'}, 404)
        }
        return c.json({success: true, data})
    } catch (error: any) {
        return c.json({ success: false, error: error.message }, 500);
    }
}

export const getUserController = async(c:Context) =>{
    try{
        const userId = Number(c.req.param('id'));
        const user = await getUserService(userId);
        if(!user){
            return c.json({success: false, error: 'User not found'}, 404)
        }
        return c.json({success: true, data: user})
    } catch(error:any){
        return c.json({success: false, error: error.message}, 500)
    }
};

export const updateUserController = async (c: Context) => {
   try {
    const userId = Number(c.req.param('id'));

    //Fetch user to ensure they exist
    const searchUser = await getUserService(userId)
    if(!searchUser){
        return c.json({message: 'User not found'}, 404);
    }

    //Extract the new data from the request body
    const updatedData = await c.req.json();

    //Ensure role-specific fields are included from request body
    const res = await updateUserService(userId, updatedData);

    return c.json({message: res}, 200)

   } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
   }
  };


  export const deleteUserController = async (c: Context) => {
    try {
      const userId = Number(c.req.param('id'));
      const searchUser = await getUserService(userId)
      if(searchUser == undefined){
        return c.json({message: 'User not found'}, 404);
      }

      //delete user
      const res = await deleteUserService(userId);

      if(!res) return c.json({message: 'User not deleted'}, 404);

      return c.json({message: res}, 200);
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  };