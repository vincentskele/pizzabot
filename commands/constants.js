// ASCII art for different pet types
const PET_ART = {
  dragon: `
      /\\___/\\
     (  o o  )
      (  T  ) 
     .^'^'^'^.
    .'/  |  \\'.
   /  |  |  |  \\
   |,-'--|--'-.|`,
  phoenix: `
       ,//\\
      /// \\\\
     ///   \\\\
    ///     \\\\
   ///  ___  \\\\
  ///  /  \\  \\\\
  ///  /   /\\  \\\\`,
  griffin: `
      /\\/\\
     ((ovo))
     ():::()
      VV-VV`,
  unicorn: `
     /\\     
    ( \\\\    
     \\ \\\\  
     _\\_\\\\__
    (______)\\
     \\______/`
};

// Command metadata
const data = {
  name: "pet-art",
  description: "Displays ASCII art for different pet types.",
};

// Export the constants
module.exports = {
  PET_ART,
  data,
};
