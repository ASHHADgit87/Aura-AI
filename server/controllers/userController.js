

export const getMe = async (req, res) => {
  try {
    
    res.json({ 
      success: true, 
      user: { 
        name: req.user.username, 
        email: req.user.email 
      } 
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};