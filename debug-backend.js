

(window as any).debugBackend = async () => {
  try {
    // Get token from localStorage if available
    const token = localStorage.getItem('auth_token');
    const headers: any = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Using authentication token:', token.substring(0, 20) + '...');
    } else {
      console.log('No authentication token found');
    }

    const response = await fetch('http://34.70.182.248:8080/admin/item', {
      method: 'GET',
      headers: headers
    });
    const products = await response.json();
    
    console.log('=== RAW BACKEND DATA ===');
    console.log('Total products:', products.length);
    
    products.forEach((product: any, index: number) => {
      console.log(`\n--- Product ${index + 1} ---`);
      console.log('ID:', product.id);
      console.log('Name:', JSON.stringify(product.name)); // Shows exact string
      console.log('Price:', product.price);
      console.log('Quantity:', product.quantity);
      console.log('Name length:', product.name?.length);
      console.log('Contains quotes:', product.name?.includes('"') || product.name?.includes("'"));
      console.log('Contains brackets:', product.name?.includes('<') || product.name?.includes('>'));
    });
    
    console.log('\n=== SUSPICIOUS PRODUCTS ===');
    const suspicious = products.filter((p: any) => {
      const name = p.name || '';
      return name.includes('<') || name.includes('>') || 
             name.includes('"') || name.includes("'") ||
             name.includes('{{') || name.includes('}}') ||
             name.includes('WAITFOR') || name.includes('DELAY') ||
             name.length > 30;
    });
    
    console.log('Suspicious count:', suspicious.length);
    suspicious.forEach((p: any) => {
      console.log('Suspicious product:', JSON.stringify(p.name));
    });
    
  } catch (error) {
    console.error('Error fetching backend data:', error);
  }
};

console.log('Debug function loaded! Run: debugBackend() in console');
