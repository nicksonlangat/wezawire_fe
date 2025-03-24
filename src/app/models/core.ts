export interface Client{
    id: string;
    email: string;
    name: string;
    phone: string;
    country: string;
    website: string;
    description: string;
    logo: string;
    about: string;

}

export interface PressRelease {
    id: string;
    title: string;
    description?: string;
    content?: string; 
    client?: string; 
    partner?: string; 
    country?: string; 
    additional_data?: Record<string, any>;
    json_content?: Record<string, any>;
    created_at: string;
    updated_at: string;
    shared_with: Journalist[];
    is_published: boolean;
}


export interface Journalist {
    id: string;
    email: string;
    name: string;
    phone: string;
    country: string;
    title: string;
    media_house: string;
}