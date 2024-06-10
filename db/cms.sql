PGDMP      ;                |            acharya-shiv     15.7 (Ubuntu 15.7-1.pgdg23.10+1)     16.3 (Ubuntu 16.3-1.pgdg23.10+1) `               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    36146    acharya-shiv    DATABASE     t   CREATE DATABASE "acharya-shiv" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_IN';
    DROP DATABASE "acharya-shiv";
                postgres    false            �            1259    36266 
   activities    TABLE     �  CREATE TABLE public.activities (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    short_description character varying(255),
    description text,
    type character varying(50) NOT NULL,
    thumbnail_url character varying(255),
    media_url character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.activities;
       public         heap    postgres    false            �            1259    36265    activities_id_seq    SEQUENCE     �   CREATE SEQUENCE public.activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.activities_id_seq;
       public          postgres    false    222                       0    0    activities_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.activities_id_seq OWNED BY public.activities.id;
          public          postgres    false    221            �            1259    36333 
   attributes    TABLE     �   CREATE TABLE public.attributes (
    attribute_id integer NOT NULL,
    attribute_name character varying(255) NOT NULL,
    attribute_values text[],
    category text,
    subcategory text,
    store_name text,
    vendor_id integer
);
    DROP TABLE public.attributes;
       public         heap    postgres    false            �            1259    36152    attributes_attribute_id_seq    SEQUENCE     �   CREATE SEQUENCE public.attributes_attribute_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.attributes_attribute_id_seq;
       public          postgres    false            �            1259    36338    attributes_attribute_id_seq1    SEQUENCE     �   CREATE SEQUENCE public.attributes_attribute_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.attributes_attribute_id_seq1;
       public          postgres    false    226                       0    0    attributes_attribute_id_seq1    SEQUENCE OWNED BY     \   ALTER SEQUENCE public.attributes_attribute_id_seq1 OWNED BY public.attributes.attribute_id;
          public          postgres    false    227            �            1259    36318    blogs    TABLE     -  CREATE TABLE public.blogs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    short_description character varying(255),
    description text,
    type character varying(50) NOT NULL,
    thumbnail_url character varying(255),
    media_url character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    keywords text,
    visibility character varying(20) DEFAULT 'private'::character varying
);
    DROP TABLE public.blogs;
       public         heap    postgres    false            �            1259    36294    blogs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.blogs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.blogs_id_seq;
       public          postgres    false            �            1259    36317    blogs_id_seq1    SEQUENCE     �   CREATE SEQUENCE public.blogs_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.blogs_id_seq1;
       public          postgres    false    225                       0    0    blogs_id_seq1    SEQUENCE OWNED BY     >   ALTER SEQUENCE public.blogs_id_seq1 OWNED BY public.blogs.id;
          public          postgres    false    224            �            1259    36339 
   categories    TABLE     �  CREATE TABLE public.categories (
    category_id integer NOT NULL,
    category_name character varying(255) NOT NULL,
    category_description text,
    category_image_url character varying(255),
    category_status boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    category_type character varying(255),
    attribute_cat_id integer[],
    vendor_id integer,
    store_name text
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    36162    categories_category_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_category_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.categories_category_id_seq;
       public          postgres    false            �            1259    36347    categories_category_id_seq1    SEQUENCE     �   CREATE SEQUENCE public.categories_category_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.categories_category_id_seq1;
       public          postgres    false    228                       0    0    categories_category_id_seq1    SEQUENCE OWNED BY     Z   ALTER SEQUENCE public.categories_category_id_seq1 OWNED BY public.categories.category_id;
          public          postgres    false    229            �            1259    36255    consultation    TABLE     �  CREATE TABLE public.consultation (
    id integer NOT NULL,
    full_name character varying(100) NOT NULL,
    age integer NOT NULL,
    contact_number character varying(15) NOT NULL,
    alternate_mobile_number character varying(15),
    diet_preference character varying(10),
    zodiac_sign character varying(20),
    relationship_status character varying(50),
    medicine_consumption text,
    disorders_or_disease text,
    purpose_of_yoga text,
    personal_notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    preferred_date date,
    preferred_time time with time zone,
    appointment_till_date date,
    appointment_till_time time with time zone,
    email_address text,
    additionaltext text,
    appointmentstatus text,
    appointmentendedbyadmintime timestamp with time zone,
    country text,
    user_state text,
    city text,
    payment_mode text,
    payment_status text,
    payment_amount text,
    payment_id text,
    payment_obj jsonb
);
     DROP TABLE public.consultation;
       public         heap    postgres    false            �            1259    36254    consultation_id_seq    SEQUENCE     �   CREATE SEQUENCE public.consultation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.consultation_id_seq;
       public          postgres    false    220                       0    0    consultation_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.consultation_id_seq OWNED BY public.consultation.id;
          public          postgres    false    219            �            1259    36348 	   customers    TABLE     �  CREATE TABLE public.customers (
    customer_id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(20),
    address_country character varying(100),
    address_company character varying(255),
    address_line1 text,
    address_line2 text,
    city character varying(100),
    state character varying(100),
    pin_code character varying(20),
    phone_number_address character varying(20),
    note text,
    collect_taxes boolean,
    customer_media text,
    vendor_id integer,
    store_name character varying(255),
    countryjsonb jsonb
);
    DROP TABLE public.customers;
       public         heap    postgres    false            �            1259    36353    customers_customer_id_seq    SEQUENCE     �   CREATE SEQUENCE public.customers_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.customers_customer_id_seq;
       public          postgres    false    230                       0    0    customers_customer_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;
          public          postgres    false    231            �            1259    36354    products    TABLE     �  CREATE TABLE public.products (
    product_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    category text,
    subcategory text,
    slug_cat character varying(255),
    slug_subcat character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    36361    products_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.products_product_id_seq;
       public          postgres    false    232                       0    0    products_product_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;
          public          postgres    false    233            �            1259    36362    stores    TABLE     �  CREATE TABLE public.stores (
    store_id integer NOT NULL,
    store_name character varying(255) NOT NULL,
    address character varying(255),
    city character varying(100),
    state character varying(100),
    country character varying(100),
    vendor_id integer,
    description text,
    phone character varying(20),
    email character varying(255),
    website character varying(255),
    logo_url character varying(255),
    banner_url character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    added_by_admin_id integer,
    status integer DEFAULT 0,
    store_slug text,
    api_key jsonb,
    CONSTRAINT stores_status_check CHECK (((status >= 0) AND (status <= 2)))
);
    DROP TABLE public.stores;
       public         heap    postgres    false            �            1259    36370    stores_store_id_seq    SEQUENCE     �   CREATE SEQUENCE public.stores_store_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.stores_store_id_seq;
       public          postgres    false    234                       0    0    stores_store_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.stores_store_id_seq OWNED BY public.stores.store_id;
          public          postgres    false    235            �            1259    36371    subcategories    TABLE     �  CREATE TABLE public.subcategories (
    subcategory_id integer NOT NULL,
    subcategory_name character varying(255) NOT NULL,
    subcategory_description text,
    subcategory_image_url character varying(255),
    parent_category_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    isfeatured boolean,
    subcat_status boolean,
    nested_subcategories jsonb
);
 !   DROP TABLE public.subcategories;
       public         heap    postgres    false            �            1259    36193     subcategories_subcategory_id_seq    SEQUENCE     �   CREATE SEQUENCE public.subcategories_subcategory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.subcategories_subcategory_id_seq;
       public          postgres    false            �            1259    36378 !   subcategories_subcategory_id_seq1    SEQUENCE     �   CREATE SEQUENCE public.subcategories_subcategory_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.subcategories_subcategory_id_seq1;
       public          postgres    false    236                       0    0 !   subcategories_subcategory_id_seq1    SEQUENCE OWNED BY     f   ALTER SEQUENCE public.subcategories_subcategory_id_seq1 OWNED BY public.subcategories.subcategory_id;
          public          postgres    false    237            �            1259    36195 
   superadmin    TABLE     �  CREATE TABLE public.superadmin (
    id integer NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone_number character varying(20),
    password character varying(255) NOT NULL,
    profile_image text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.superadmin;
       public         heap    postgres    false            �            1259    36202    superadmin_id_seq    SEQUENCE     �   CREATE SEQUENCE public.superadmin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.superadmin_id_seq;
       public          postgres    false    217                       0    0    superadmin_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.superadmin_id_seq OWNED BY public.superadmin.id;
          public          postgres    false    218            �            1259    36379    vendors_registration    TABLE     �  CREATE TABLE public.vendors_registration (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    vendor_image character varying(255),
    joined_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    phone_number character varying(20),
    website_url character varying(255),
    contact_person_name character varying(100),
    contact_person_email character varying(100),
    company_name character varying(100),
    company_logo_url character varying(255),
    business_type character varying(50),
    industry character varying(50),
    head_office_address_line1 character varying(255),
    head_office_address_line2 character varying(255),
    head_office_city character varying(100),
    head_office_state character varying(100),
    head_office_country character varying(100),
    head_office_zipcode character varying(20),
    is_multiple_shop boolean DEFAULT false,
    about_company text,
    vendor_status integer DEFAULT 1,
    CONSTRAINT vendors_registration_vendor_status_check CHECK ((vendor_status = ANY (ARRAY[1, 2, 3, 4])))
);
 (   DROP TABLE public.vendors_registration;
       public         heap    postgres    false            �            1259    36388    vendors_registration_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendors_registration_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.vendors_registration_id_seq;
       public          postgres    false    238                       0    0    vendors_registration_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.vendors_registration_id_seq OWNED BY public.vendors_registration.id;
          public          postgres    false    239            &           2604    36269    activities id    DEFAULT     n   ALTER TABLE ONLY public.activities ALTER COLUMN id SET DEFAULT nextval('public.activities_id_seq'::regclass);
 <   ALTER TABLE public.activities ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221    222            -           2604    36389    attributes attribute_id    DEFAULT     �   ALTER TABLE ONLY public.attributes ALTER COLUMN attribute_id SET DEFAULT nextval('public.attributes_attribute_id_seq1'::regclass);
 F   ALTER TABLE public.attributes ALTER COLUMN attribute_id DROP DEFAULT;
       public          postgres    false    227    226            )           2604    36321    blogs id    DEFAULT     e   ALTER TABLE ONLY public.blogs ALTER COLUMN id SET DEFAULT nextval('public.blogs_id_seq1'::regclass);
 7   ALTER TABLE public.blogs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224    225            .           2604    36390    categories category_id    DEFAULT     �   ALTER TABLE ONLY public.categories ALTER COLUMN category_id SET DEFAULT nextval('public.categories_category_id_seq1'::regclass);
 E   ALTER TABLE public.categories ALTER COLUMN category_id DROP DEFAULT;
       public          postgres    false    229    228            $           2604    36258    consultation id    DEFAULT     r   ALTER TABLE ONLY public.consultation ALTER COLUMN id SET DEFAULT nextval('public.consultation_id_seq'::regclass);
 >   ALTER TABLE public.consultation ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            2           2604    36391    customers customer_id    DEFAULT     ~   ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);
 D   ALTER TABLE public.customers ALTER COLUMN customer_id DROP DEFAULT;
       public          postgres    false    231    230            3           2604    36392    products product_id    DEFAULT     z   ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);
 B   ALTER TABLE public.products ALTER COLUMN product_id DROP DEFAULT;
       public          postgres    false    233    232            6           2604    36393    stores store_id    DEFAULT     r   ALTER TABLE ONLY public.stores ALTER COLUMN store_id SET DEFAULT nextval('public.stores_store_id_seq'::regclass);
 >   ALTER TABLE public.stores ALTER COLUMN store_id DROP DEFAULT;
       public          postgres    false    235    234            9           2604    36394    subcategories subcategory_id    DEFAULT     �   ALTER TABLE ONLY public.subcategories ALTER COLUMN subcategory_id SET DEFAULT nextval('public.subcategories_subcategory_id_seq1'::regclass);
 K   ALTER TABLE public.subcategories ALTER COLUMN subcategory_id DROP DEFAULT;
       public          postgres    false    237    236            !           2604    36395    superadmin id    DEFAULT     n   ALTER TABLE ONLY public.superadmin ALTER COLUMN id SET DEFAULT nextval('public.superadmin_id_seq'::regclass);
 <   ALTER TABLE public.superadmin ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217            <           2604    36396    vendors_registration id    DEFAULT     �   ALTER TABLE ONLY public.vendors_registration ALTER COLUMN id SET DEFAULT nextval('public.vendors_registration_id_seq'::regclass);
 F   ALTER TABLE public.vendors_registration ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    239    238            �          0    36266 
   activities 
   TABLE DATA           �   COPY public.activities (id, title, slug, short_description, description, type, thumbnail_url, media_url, created_at, updated_at) FROM stdin;
    public          postgres    false    222   k�       �          0    36333 
   attributes 
   TABLE DATA           �   COPY public.attributes (attribute_id, attribute_name, attribute_values, category, subcategory, store_name, vendor_id) FROM stdin;
    public          postgres    false    226   ��       �          0    36318    blogs 
   TABLE DATA           �   COPY public.blogs (id, title, slug, short_description, description, type, thumbnail_url, media_url, created_at, updated_at, keywords, visibility) FROM stdin;
    public          postgres    false    225   �                  0    36339 
   categories 
   TABLE DATA           �   COPY public.categories (category_id, category_name, category_description, category_image_url, category_status, created_at, updated_at, category_type, attribute_cat_id, vendor_id, store_name) FROM stdin;
    public          postgres    false    228   o�       �          0    36255    consultation 
   TABLE DATA           �  COPY public.consultation (id, full_name, age, contact_number, alternate_mobile_number, diet_preference, zodiac_sign, relationship_status, medicine_consumption, disorders_or_disease, purpose_of_yoga, personal_notes, created_at, preferred_date, preferred_time, appointment_till_date, appointment_till_time, email_address, additionaltext, appointmentstatus, appointmentendedbyadmintime, country, user_state, city, payment_mode, payment_status, payment_amount, payment_id, payment_obj) FROM stdin;
    public          postgres    false    220   I�                 0    36348 	   customers 
   TABLE DATA             COPY public.customers (customer_id, first_name, last_name, email, password, phone, address_country, address_company, address_line1, address_line2, city, state, pin_code, phone_number_address, note, collect_taxes, customer_media, vendor_id, store_name, countryjsonb) FROM stdin;
    public          postgres    false    230   ��                 0    36354    products 
   TABLE DATA           �   COPY public.products (product_id, title, description, category, subcategory, slug_cat, slug_subcat, created_at, updated_at) FROM stdin;
    public          postgres    false    232   2�                 0    36362    stores 
   TABLE DATA           �   COPY public.stores (store_id, store_name, address, city, state, country, vendor_id, description, phone, email, website, logo_url, banner_url, created_at, added_by_admin_id, status, store_slug, api_key) FROM stdin;
    public          postgres    false    234   O�                 0    36371    subcategories 
   TABLE DATA           �   COPY public.subcategories (subcategory_id, subcategory_name, subcategory_description, subcategory_image_url, parent_category_id, created_at, updated_at, isfeatured, subcat_status, nested_subcategories) FROM stdin;
    public          postgres    false    236   /�       �          0    36195 
   superadmin 
   TABLE DATA           �   COPY public.superadmin (id, first_name, last_name, email, phone_number, password, profile_image, created_at, updated_at) FROM stdin;
    public          postgres    false    217   �       
          0    36379    vendors_registration 
   TABLE DATA           �  COPY public.vendors_registration (id, name, email, password, vendor_image, joined_date, phone_number, website_url, contact_person_name, contact_person_email, company_name, company_logo_url, business_type, industry, head_office_address_line1, head_office_address_line2, head_office_city, head_office_state, head_office_country, head_office_zipcode, is_multiple_shop, about_company, vendor_status) FROM stdin;
    public          postgres    false    238   ��                  0    0    activities_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.activities_id_seq', 19, true);
          public          postgres    false    221                       0    0    attributes_attribute_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.attributes_attribute_id_seq', 1, false);
          public          postgres    false    214                       0    0    attributes_attribute_id_seq1    SEQUENCE SET     J   SELECT pg_catalog.setval('public.attributes_attribute_id_seq1', 2, true);
          public          postgres    false    227                        0    0    blogs_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.blogs_id_seq', 1, false);
          public          postgres    false    223            !           0    0    blogs_id_seq1    SEQUENCE SET     <   SELECT pg_catalog.setval('public.blogs_id_seq1', 39, true);
          public          postgres    false    224            "           0    0    categories_category_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public.categories_category_id_seq', 1, false);
          public          postgres    false    215            #           0    0    categories_category_id_seq1    SEQUENCE SET     I   SELECT pg_catalog.setval('public.categories_category_id_seq1', 3, true);
          public          postgres    false    229            $           0    0    consultation_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.consultation_id_seq', 38, true);
          public          postgres    false    219            %           0    0    customers_customer_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.customers_customer_id_seq', 1, true);
          public          postgres    false    231            &           0    0    products_product_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.products_product_id_seq', 1, false);
          public          postgres    false    233            '           0    0    stores_store_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.stores_store_id_seq', 28, true);
          public          postgres    false    235            (           0    0     subcategories_subcategory_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.subcategories_subcategory_id_seq', 1, false);
          public          postgres    false    216            )           0    0 !   subcategories_subcategory_id_seq1    SEQUENCE SET     O   SELECT pg_catalog.setval('public.subcategories_subcategory_id_seq1', 1, true);
          public          postgres    false    237            *           0    0    superadmin_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.superadmin_id_seq', 1, true);
          public          postgres    false    218            +           0    0    vendors_registration_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.vendors_registration_id_seq', 20, true);
          public          postgres    false    239            I           2606    36276    activities activities_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.activities DROP CONSTRAINT activities_pkey;
       public            postgres    false    222            K           2606    36278    activities activities_slug_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_slug_key UNIQUE (slug);
 H   ALTER TABLE ONLY public.activities DROP CONSTRAINT activities_slug_key;
       public            postgres    false    222            Q           2606    36398    attributes attributes_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_pkey PRIMARY KEY (attribute_id);
 D   ALTER TABLE ONLY public.attributes DROP CONSTRAINT attributes_pkey;
       public            postgres    false    226            M           2606    36327    blogs blogs_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.blogs DROP CONSTRAINT blogs_pkey;
       public            postgres    false    225            O           2606    36329    blogs blogs_slug_key 
   CONSTRAINT     O   ALTER TABLE ONLY public.blogs
    ADD CONSTRAINT blogs_slug_key UNIQUE (slug);
 >   ALTER TABLE ONLY public.blogs DROP CONSTRAINT blogs_slug_key;
       public            postgres    false    225            S           2606    36400    categories categories_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (category_id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    228            G           2606    36264    consultation consultation_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.consultation
    ADD CONSTRAINT consultation_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.consultation DROP CONSTRAINT consultation_pkey;
       public            postgres    false    220            U           2606    36402    customers customers_email_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);
 G   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_email_key;
       public            postgres    false    230            W           2606    36404    customers customers_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);
 B   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_pkey;
       public            postgres    false    230            Y           2606    36406    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    232            [           2606    36408    stores stores_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (store_id);
 <   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_pkey;
       public            postgres    false    234            ]           2606    36410     subcategories subcategories_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.subcategories
    ADD CONSTRAINT subcategories_pkey PRIMARY KEY (subcategory_id);
 J   ALTER TABLE ONLY public.subcategories DROP CONSTRAINT subcategories_pkey;
       public            postgres    false    236            C           2606    36236    superadmin superadmin_email_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_email_key UNIQUE (email);
 I   ALTER TABLE ONLY public.superadmin DROP CONSTRAINT superadmin_email_key;
       public            postgres    false    217            E           2606    36238    superadmin superadmin_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.superadmin
    ADD CONSTRAINT superadmin_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.superadmin DROP CONSTRAINT superadmin_pkey;
       public            postgres    false    217            _           2606    36412 3   vendors_registration vendors_registration_email_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.vendors_registration
    ADD CONSTRAINT vendors_registration_email_key UNIQUE (email);
 ]   ALTER TABLE ONLY public.vendors_registration DROP CONSTRAINT vendors_registration_email_key;
       public            postgres    false    238            a           2606    36414 .   vendors_registration vendors_registration_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.vendors_registration
    ADD CONSTRAINT vendors_registration_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY public.vendors_registration DROP CONSTRAINT vendors_registration_pkey;
       public            postgres    false    238            b           2606    36415 $   stores stores_added_by_admin_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_added_by_admin_id_fkey FOREIGN KEY (added_by_admin_id) REFERENCES public.superadmin(id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_added_by_admin_id_fkey;
       public          postgres    false    217    3397    234            c           2606    36420    stores stores_vendor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors_registration(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.stores DROP CONSTRAINT stores_vendor_id_fkey;
       public          postgres    false    234    238    3425            �     x��V]o�0}�"��&[���W�дj}�V	iݤJU )��&#�U����@B���`���9�~�Lq�q����ĉWi�,�r�=�\>/�W�4�Z
�	I&�u�>�����c�~FʽC&	͟�۹>�]!��0Soo�j�6b���O #��B6�#f��WGk�YQ��Ţ��jJ��3/�S��0����C��Q&���0�ƅPpwq'��\k��6e9/�\o~Lc+�_�\<��f��ȫ�ϛ�}�d��Z`��CL�t$1r�.�6����M��e�x�t����7h���"�Y�e1�sr��S���$���$H(r}�Ч���[��Q�a:BN�?���� ��ui�F����/8'��Y++.#n�t~�8$�*����6�G�Gk���M��U���p�e��j��%�,��\it܅���|�S^)���S������\�����H0j�O/S��6"�z������`���E���uIh��V麖����Uu�HD�P+�Ep��ր��a���$C����E���:jG���4`p�Dc�Ɨ;���F������ y��v���Xu�ݑ�g��[]�un���e�����g��uyK�zY�5P��|�� �+�Z�\)%�uf���c�����rV+J_��c7�T2���A� �'&[��xr�����ՠK|��F{�RpU��K2.��r�q�z��@j�uqs�ge � ����]�����|�X���S�7Fj�_���ű�҉���@C�1F�Ν�������h��@�G      �   Q   x�3�άJ嬎��	�����	��VrvqV�Q*NL�B +�8�X)(�	�|K�S�3t�R�SsrR�*9��b���� ���      �   {  x��V]o� }v~��`��"�Ҵ��U�=L�����$�2�����i����*R�k��b��s.���6Y��Z��j�]�֬�m�
mT�u�h�M�Ҡ茫t���.�Т薣+���.�DL)���`S��8��1�	G4��/��1>��r��@T�cԿ�������*�{�B���C�/�"�YN1�(�&;��SvZ�ya���kPj\U[�����z5�cB���wBNh��雐�bx-hp�1����M�Q�?R��)�3J��Q��a���J{
j��a��O��ߍQ}�WZ�N��4Qx��$!I��,8���nle�����pHb�j��!JC�"�S.N1䣾ʒ18��fq6�6��m��h���d)��T��rR?C
�����g�a�؛wߘ͓d)�e��uu�sڢG]l_�n��8'�}�{�����AY���A��9���1<N��J:{Ѷ��V��rH	�2�"�\�O�3�ou��E0�Ms,gt�^�����������+�����`/�2�����Y�"�@O���=X�����G�)��g�p�𜀩�WY���ʻ�<qr|��{���x�mzX�{�`�V��#��[4�����,          �   x�}��N1Dk�+�������u��� !�M��̥Hr��!Ŀs"�I�)�if�D�~�E(�}�����-(��a�	dKK�q��]-�>��$�.m����S��C�X�_ Ÿ������Ě������C.b�1Fp!괛r>��X��lW�h��7�� ���-��q��G Ҟ{~ҩ�S֯|�rk���8oVq      �   D  x�ŘkO�\�_�O��v�����WJ�-�T�*�97�6�Rx��}ǉK�$��j�Ac�O����g`"�Y�#c^U�\_��<�By-c�������]��Դ�n1F�� ����
W�M[W���<}�݌a8j��8�r�M��k���$�P�w'a�>�vav����C������>�a���w�7f=x����0d��O�O�����9#g��eo����M^��_�8�_^m�ks^�gu�41��au�[�Y�|~�/�p}�lx3��]�=\�BDH��**Vi��䎂6ʀ��s�Aq41��-��f���l�ی�1D�M�T��ƕ�?���������veGS�gË|��ۑ~v�Q�d�щZCc��N� �c\8k�ǵ����Px4�SF+V�6Ǜή�4,o���!�y�E��j���
򿂠�V�/�j	_ Ėb���L�ͭ�W+U�0�Y�a 9�sdz>�I�%ۻ�̎���/Vd�8����餻�www|::������U$t����'�=��C-
�r.p+�hƩ6�$��3��YE���b=Б���:i�g$�U�s������ǯ*�2�Ti���j�?U��-0;YK&�^�GT]V�V�`���X���L� ��4�g����a-����]�3.>.>4�{�u����C���:h���|Y��+gE�@LB⠩�W*R�Z<�	k��
"���R�(���/��/C���hM��:_Y�-W����Md�D�V^����i�����Mm�H^n�Ӝ'�������'�&������A�Yy�1�:h������[�i�R�s��<���)��Ќp����'�E�����L�������h+��`U5�Ҧ��U�|�dJEm*^��o��t*�%��W�6݋��}gD��Ĺ���8��ɷ駇˫��٢��d6d��9�-Bri��Q8���>i"�`����I�g�lgY&sƖu�H[��&d.�Y�bv�Q�M[R�f��F6+T��j�+���=�
�yQx:_�1�/���,���U�B����a��qJ'̈́��Y�������`�/���ؗ�C�!jJ�M���H+��&(��b'�&����m
qQ��f�ɣ�[c��ԕ��uKb6�X�
�l ķy�������>�n�c.�&E�oi"^��y>��0��r:hT��	��n�w��4+���v����xO&F�(6�Nre�W*(�A
�)�c�؍(��9X*U�Y�m�>sϲ��񪹽l���-�7'�p�F�5z���pc���5�.�G���{�*}g�p鞥$���7�]q�w��u��T�>"n�=mq8�	x�~i�=w�["�w�x)���bPP�_����8��LxZj5ʃ4Us{g�S�j�$ۢ�5#����3�^�y��+�?ԃ#b!�=s{�O�Ǜ��+�!�����Z4�(�^yLlÕ�AJ������p)vf���z�S83%9auY��5\c>�G��[�]d8���mmx�p�f��l0�Z�������E���&��2������4�{�/������L��p�9�g99N,8I�t܆bD�8V�BOJ�zs��{/���v���l`_��ͪIZ��&-�-�_[���I����Ϗ�mC��M9^��ѻŷ���%��3�ט�D�{�I��L�v��znR
C���I����R���*�U�k��V�Ҫ�V/%g#����|;���k;�&��w��
�oE�JQD�\N�jn��Ҡ�m�]��YȾ�d���}4S���&���nb�����1�X9�jj��uh�?y���^�n d{0��݃G�LF�����������f81         �  x�U�OR�0����;mMRڀ+�QFe uD]�6��m�i��k���x1�`
��7�E~��}o��8�1��AJ�� ����K
�s7�h�Y��N����tJ���A>:�!?d��GvM�ɀ���˝���_�*�D��Ǡ���'苘S`�+3�$S�2�3�.�AT�ZL���9� �F��P���8R��2�����9(����^��=kx�>�`N�����g��L��7{���޵���Os��m��`5[�/eO�+vV��R���eEF5ʩ�Z�0t��,%)�?���C*�~�;�F����Ҡ�7[��m��X�?�*�&�X?��k�~���@����I����i#�NB��l��7��X�'��묋Io���w�ƭ�h4~ ���`            x������ � �         �   x����
�0���S�.�Y��OA��]�T�nlR����Np�����_�Fe��9Z-_ӫ������}���&�{�
�B+cr&q1h�,�f0�����MTp��,��|�o�O��oxB��e�:����Qqi�\��ܶ|�����IDg��i��M�����\����[��eN,�h��oH�8�ڤ��F�z��,VZqL�m�         �   x�}M��0��S4����:�&�bH)_�Q
ia0�wFMn���qt4��@U�$LD!��dXȌ�,�4N�=K�YKu��ML�:�g�$&����X�&��:�^��S�Y������X&���EQy���t��ab�O��~n��ڪ֫�h�i�kg��vMb���ɾEQ      �   �   x���;�0  й����2�1&��DC\�E(T�no<���#��U�A�U�! s>���[x� �q������'��lx��~��܃ƭ�eߤ��(�{�х�NhVn�0�2��|�\G���C�P�Qƶ��FV9�\��/�@�QUo�S>�lF�𘇱�0
�������;A��=v      
   �  x�e�]o� ����Enq c�}�l�Pe��t[�J����&5�Y��G�i�:���9���)�p`/�R��i��v`N��yr=�=�k�<\-�#]m���ס��٦ξ$��q���Ӹ�Ǹ!`R}e��N�
b�1��q�rw��2;Mi{hGߚ^A班���VxU��6^A)�]=ر�����3C�t�N�64�r'Uz;@Ӷ��A7al��3��f�j@�%����F1�9�@yjJ����X,�,_�͟x�t>u�A��BN�~��K��. �w:���=�9�SD��T�gy<x��/oi}�T]�_|�/6�nQ�=��o�/���O��c|�~����_'��"aEBb����p��I�|뱓o۰�k�b�@p�WF ��$x;=�Q�k{�>     