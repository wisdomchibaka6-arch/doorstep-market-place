import React, { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Image,
  ImageSourcePropType,
  KeyboardTypeOptions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';

const assets = {
  banner: require('../assets/images/local-shopping-banner.jpg'),
  hoodie: require('../assets/images/hoodie.jpg'),
  sneakers: require('../assets/images/sneakers.jpg'),
  icon: require('../assets/images/icon.png'),
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image: ImageSourcePropType;
};

type Screen =
  | 'home'
  | 'browse'
  | 'myShop'
  | 'account'
  | 'createInfo'
  | 'createCategory'
  | 'createProduct'
  | 'manageProducts'
  | 'manageCategories'
  | 'shopView'
  | 'productDetail';

const initialProducts: Product[] = [
  {
    id: 'hoodie',
    name: 'Faith Over Fear Hoodie',
    category: "Men's Clothing",
    price: 25,
    stock: 10,
    description:
      'Comfortable hoodie with a positive message. Made from high-quality cotton.',
    image: assets.hoodie,
  },
  {
    id: 'shirt',
    name: 'God is Good T-Shirt',
    category: "Women's Clothing",
    price: 18,
    stock: 15,
    description: 'Soft everyday tee with a simple message of encouragement.',
    image: assets.hoodie,
  },
  {
    id: 'sneakers',
    name: "Men's Sneakers",
    category: 'Shoes',
    price: 40,
    stock: 8,
    description: 'Clean, comfortable sneakers for every day.',
    image: assets.sneakers,
  },
  {
    id: 'watch',
    name: 'Classic Watch',
    category: 'Accessories',
    price: 60,
    stock: 5,
    description: 'A classic everyday watch with a polished finish.',
    image: assets.sneakers,
  },
];

const categories = [
  { label: 'Fashion', icon: 'shirt', color: 'pink' as const },
  { label: 'Shoes', icon: 'walk', color: 'cyan' as const },
  { label: 'Electronics', icon: 'laptop-outline', color: 'blue' as const },
  { label: 'Home & Living', icon: 'home-outline', color: 'green' as const },
  { label: 'Beauty & Personal Care', icon: 'flower-outline', color: 'purple' as const },
  { label: 'Food & Beverages', icon: 'fast-food-outline', color: 'orange' as const },
  { label: 'Books', icon: 'book-outline', color: 'cyan' as const },
  { label: 'More', icon: 'grid-outline', color: 'blue' as const },
];

function tap() {
  void Haptics.selectionAsync();
}

function Money({ value, large = false }: { value: number; large?: boolean }) {
  const colors = useColors();
  return (
    <Text style={[styles.money, large && styles.moneyLarge, { color: colors.navy }]}>
      ${value.toFixed(2)}
    </Text>
  );
}

function IconButton({
  name,
  onPress,
  color,
  size = 20,
  accessibilityLabel,
}: {
  name: string;
  onPress?: () => void;
  color: string;
  size?: number;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      testID={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
    >
      <Ionicons name={name as never} size={size} color={color} />
    </Pressable>
  );
}

function AppHeader({
  title,
  subtitle,
  onBack,
  right,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 4 }]}>
      {onBack ? (
        <IconButton
          name="chevron-back"
          color={colors.navy}
          size={22}
          onPress={onBack}
          accessibilityLabel="Go back"
        />
      ) : (
        <View style={styles.brandMark}>
          <Ionicons name="location" size={22} color={colors.primary} />
        </View>
      )}
      <View style={styles.headerCopy}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      </View>
      {right ?? <View style={styles.headerSpacer} />}
    </View>
  );
}

function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search for shops, products or categories...',
  onPress,
}: {
  value: string;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  onPress?: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.searchBar, pressed && styles.pressed]}
    >
      <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
      <TextInput
        editable={Boolean(onChangeText)}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        style={styles.searchInput}
      />
      {value.length > 0 ? (
        <Ionicons name="close-circle" size={17} color={colors.mutedForeground} />
      ) : null}
    </Pressable>
  );
}

function BottomNav({
  screen,
  onChange,
}: {
  screen: Screen;
  onChange: (screen: Screen) => void;
}) {
  const colors = useColors();
  const items: { id: Screen; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home-outline' },
    { id: 'browse', label: 'Browse', icon: 'search-outline' },
    { id: 'myShop', label: 'My Shop', icon: 'storefront-outline' },
    { id: 'account', label: 'My Account', icon: 'person-outline' },
  ];
  return (
    <View style={styles.bottomNav}>
      {items.map((item) => {
        const active = screen === item.id;
        return (
          <Pressable
            key={item.id}
            testID={`tab-${item.id}`}
            onPress={() => {
              tap();
              onChange(item.id);
            }}
            style={styles.navItem}
          >
            <Ionicons
              name={(active ? item.icon.replace('-outline', '') : item.icon) as never}
              size={20}
              color={active ? colors.primary : colors.mutedForeground}
            />
            <Text style={[styles.navLabel, active && { color: colors.primary }]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ScreenShell({
  children,
  screen,
  onNav,
  showNav = true,
}: {
  children: React.ReactNode;
  screen: Screen;
  onNav: (screen: Screen) => void;
  showNav?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      {children}
      {showNav ? <BottomNav screen={screen} onChange={onNav} /> : null}
      <View pointerEvents="none" style={{ height: showNav ? insets.bottom : 0 }} />
    </View>
  );
}

function SectionTitle({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function ShopBadge() {
  const colors = useColors();
  return (
    <View style={[styles.shopBadge, { backgroundColor: colors.navy }]}>
      <Text style={styles.shopBadgeCross}>✦</Text>
      <Text style={styles.shopBadgeGod}>GOD</Text>
    </View>
  );
}

function ProductCard({
  product,
  onPress,
  compact = false,
}: {
  product: Product;
  onPress: () => void;
  compact?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      testID={`product-${product.id}`}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.productCard, compact && styles.productCardCompact, pressed && styles.pressed]}
    >
      <View style={styles.productImageWrap}>
        <Image source={product.image} style={styles.productImage} resizeMode="cover" />
        <View style={styles.cartBubble}>
          <Ionicons name="cart-outline" size={14} color={colors.primary} />
        </View>
      </View>
      <Text numberOfLines={1} style={styles.productName}>{product.name}</Text>
      <Money value={product.price} />
      <Text style={styles.productRating}>★ 4.8 ({product.id === 'hoodie' ? 12 : 7} reviews)</Text>
      <Text style={[styles.stockText, { color: colors.green }]}>In stock: {product.stock}</Text>
    </Pressable>
  );
}

function HomeScreen({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void;
}) {
  const colors = useColors();
  return (
    <ScreenShell screen="home" onNav={onNavigate}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader
          title="Doorstep Market"
          subtitle="Shop Local  •  Support Local"
          right={
            <IconButton
              name="notifications-outline"
              color={colors.navy}
              accessibilityLabel="Notifications"
            />
          }
        />
        <Pressable
          onPress={() => onNavigate('browse')}
          style={({ pressed }) => [styles.heroBanner, pressed && styles.pressed]}
        >
          <Image source={assets.banner} resizeMode="cover" style={styles.heroImage} />
          <View style={styles.heroShade} />
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Local Shops{'\n'}Real People{'\n'}Great Products</Text>
            <Text style={styles.heroSubtitle}>Discover your neighborhood{'\n'}and support small businesses.</Text>
          </View>
        </Pressable>
        <SearchBar value="" onPress={() => onNavigate('browse')} />
        <SectionTitle title="Browse Categories" action="See All" onAction={() => onNavigate('browse')} />
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <Pressable
              key={category.label}
              onPress={() => onNavigate('browse')}
              style={({ pressed }) => [styles.categoryItem, pressed && styles.pressed]}
            >
              <View style={[styles.categoryIcon, { backgroundColor: colors[category.color] + '18' }]}>
                <Ionicons name={category.icon as never} size={22} color={colors[category.color]} />
              </View>
              <Text numberOfLines={2} style={styles.categoryLabel}>{category.label}</Text>
            </Pressable>
          ))}
        </View>
        <SectionTitle title="Popular Shops Near You" action="See All" onAction={() => onNavigate('browse')} />
        <Pressable onPress={() => onNavigate('shopView')} style={({ pressed }) => [styles.shopListCard, pressed && styles.pressed]}>
          <ShopBadge />
          <View style={styles.shopListCopy}>
            <Text style={styles.shopName}>Glory of God Shop</Text>
            <Text style={styles.shopMeta}>Faith  •  Quality  •  Style</Text>
            <Text style={styles.rating}>★ <Text style={styles.ratingText}>4.8 (12 reviews)</Text></Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
        </Pressable>
      </ScrollView>
    </ScreenShell>
  );
}

function BrowseScreen({
  products,
  onNavigate,
  onProduct,
}: {
  products: Product[];
  onNavigate: (screen: Screen) => void;
  onProduct: (product: Product) => void;
}) {
  const colors = useColors();
  const [query, setQuery] = useState('Glory of God Shop');
  const visibleProducts = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()) || query === 'Glory of God Shop');
  return (
    <ScreenShell screen="browse" onNav={onNavigate}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader
          title="Browse"
          right={<IconButton name="cart-outline" color={colors.navy} accessibilityLabel="Cart" />}
        />
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search shops and products" />
        <View style={styles.filterRow}>
          {['All', 'Shops', 'Products', 'Categories'].map((filter, index) => (
            <Pressable key={filter} style={[styles.filterChip, index === 0 && { backgroundColor: colors.primary }]}>
              <Text style={[styles.filterText, index === 0 && { color: colors.primaryForeground }]}>{filter}</Text>
            </Pressable>
          ))}
        </View>
        <SectionTitle title="Shops" action="See All" />
        <Pressable onPress={() => onNavigate('shopView')} style={({ pressed }) => [styles.browseShopCard, pressed && styles.pressed]}>
          <ShopBadge />
          <View style={styles.shopListCopy}>
            <Text style={styles.shopName}>Glory of God Shop</Text>
            <Text style={styles.shopMeta}>Faith  •  Quality  •  Style</Text>
            <Text style={styles.rating}>★ <Text style={styles.ratingText}>4.8 (12 reviews)</Text></Text>
            <Text style={styles.distance}>⌖ 2.3 km away</Text>
          </View>
          <Pressable onPress={() => onNavigate('shopView')} style={[styles.outlineSmallButton, { borderColor: colors.primary }]}>
            <Text style={[styles.outlineSmallText, { color: colors.primary }]}>Visit Shop</Text>
          </Pressable>
        </Pressable>
        <SectionTitle title="Products from this shop" />
        <View style={styles.productGrid}>
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onPress={() => onProduct(product)} />
          ))}
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

function MyShopScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const colors = useColors();
  return (
    <ScreenShell screen="myShop" onNav={onNavigate}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader
          title="My Shop"
          right={<IconButton name="notifications-outline" color={colors.navy} accessibilityLabel="Notifications" />}
        />
        <View style={styles.myShopCard}>
          <ShopBadge />
          <View style={styles.shopListCopy}>
            <Text style={styles.shopName}>Glory of God Shop</Text>
            <Text style={styles.shopMeta}>Faith  •  Quality  •  Style</Text>
            <Text style={[styles.activeStatus, { color: colors.green }]}>● Active</Text>
          </View>
          <Pressable onPress={() => onNavigate('shopView')} style={[styles.outlineSmallButton, { borderColor: colors.primary }]}>
            <Text style={[styles.outlineSmallText, { color: colors.primary }]}>View Store</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => onNavigate('createProduct')} style={({ pressed }) => [styles.actionCard, { backgroundColor: colors.softBlue }, pressed && styles.pressed]}>
          <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="bag-add-outline" size={25} color={colors.primaryForeground} />
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Sell a Product</Text>
            <Text style={styles.actionSubtitle}>List a single product for sale quickly and easily.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.navy} />
        </Pressable>
        <Pressable onPress={() => onNavigate('createInfo')} style={({ pressed }) => [styles.actionCard, { backgroundColor: '#F1F6FF' }, pressed && styles.pressed]}>
          <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="storefront-outline" size={25} color={colors.primaryForeground} />
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Create Your Own Shop</Text>
            <Text style={styles.actionSubtitle}>Build your shop, add categories, list multiple products and manage your store.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.navy} />
        </Pressable>
        <View style={styles.manageLinks}>
          <Pressable onPress={() => onNavigate('manageProducts')} style={styles.manageLink}>
            <Ionicons name="cube-outline" size={20} color={colors.primary} />
            <Text style={styles.manageLinkText}>Manage Products</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.mutedForeground} />
          </Pressable>
          <Pressable onPress={() => onNavigate('manageCategories')} style={styles.manageLink}>
            <Ionicons name="pricetags-outline" size={20} color={colors.primary} />
            <Text style={styles.manageLinkText}>Manage Categories</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

function AccountScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const colors = useColors();
  return (
    <ScreenShell screen="account" onNav={onNavigate}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AppHeader title="My Account" right={<IconButton name="settings-outline" color={colors.navy} accessibilityLabel="Settings" />} />
        <View style={styles.accountHero}>
          <View style={[styles.avatar, { backgroundColor: colors.softBlue }]}>
            <Ionicons name="person" size={34} color={colors.primary} />
          </View>
          <Text style={styles.accountName}>Welcome back</Text>
          <Text style={styles.accountSub}>Shop local. Support local.</Text>
        </View>
        {['My orders', 'Saved shops', 'Notifications', 'Help & support'].map((item, index) => (
          <Pressable key={item} style={({ pressed }) => [styles.manageLink, pressed && styles.pressed]}>
            <Ionicons name={['receipt-outline', 'heart-outline', 'notifications-outline', 'help-circle-outline'][index] as never} size={20} color={colors.primary} />
            <Text style={styles.manageLinkText}>{item}</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </ScrollView>
    </ScreenShell>
  );
}

function ProgressSteps({ step }: { step: number }) {
  const colors = useColors();
  const labels = ['Shop Info', 'Categories', 'Add Products', 'Review'];
  return (
    <View style={styles.progressRow}>
      {labels.map((label, index) => {
        const current = index + 1 === step;
        const complete = index + 1 < step;
        return (
          <React.Fragment key={label}>
            <View style={styles.progressItem}>
              <View style={[styles.progressCircle, (current || complete) && { backgroundColor: colors.primary }]}>
                {complete ? <Ionicons name="checkmark" size={12} color={colors.primaryForeground} /> : <Text style={[styles.progressNumber, current && { color: colors.primaryForeground }]}>{index + 1}</Text>}
              </View>
              <Text style={[styles.progressLabel, current && { color: colors.primary, fontWeight: '700' }]}>{label}</Text>
            </View>
            {index < labels.length - 1 ? <View style={[styles.progressLine, complete && { backgroundColor: colors.primary }]} /> : null}
          </React.Fragment>
        );
      })}
    </View>
  );
}

function WizardFooter({
  onNext,
  label = 'Next',
  onCancel,
}: {
  onNext: () => void;
  label?: string;
  onCancel?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.wizardFooter}>
      {onCancel ? (
        <Pressable onPress={onCancel} style={[styles.cancelButton, { borderColor: colors.primary }]}>
          <Text style={[styles.cancelText, { color: colors.primary }]}>Cancel</Text>
        </Pressable>
      ) : null}
      <Pressable testID={`wizard-${label}`} onPress={onNext} style={[styles.primaryButton, !onCancel && styles.primaryButtonFull, { backgroundColor: colors.primary }]}>
        <Text style={styles.primaryButtonText}>{label}</Text>
      </Pressable>
    </View>
  );
}

function CreateInfoScreen({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const colors = useColors();
  const [shopName, setShopName] = useState('Glory of God Shop');
  return (
    <ScreenShell screen="myShop" onNav={() => undefined} showNav={false}>
      <KeyboardAwareScrollViewCompat contentContainerStyle={styles.wizardContent} bottomOffset={80}>
        <AppHeader title="Create Your Shop" onBack={onBack} />
        <ProgressSteps step={1} />
        <Text style={styles.formTitle}>Shop Name</Text>
        <Text style={styles.formHint}>What is the name of your shop?</Text>
        <TextInput value={shopName} onChangeText={setShopName} style={styles.formInput} placeholder="Enter shop name" placeholderTextColor={colors.mutedForeground} />
        <View style={styles.wizardSpacer} />
        <WizardFooter onNext={onNext} onCancel={onBack} />
      </KeyboardAwareScrollViewCompat>
    </ScreenShell>
  );
}

function CreateCategoryScreen({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const colors = useColors();
  const [selected, setSelected] = useState<string[]>(["Men's Clothing", "Women's Clothing"]);
  const choices = ["Men's Clothing", "Women's Clothing", "Kids' Clothing", 'Shoes', 'Accessories', 'Bags'];
  return (
    <ScreenShell screen="myShop" onNav={() => undefined} showNav={false}>
      <ScrollView contentContainerStyle={styles.wizardContent}>
        <AppHeader title="Create Your Shop" onBack={onBack} />
        <ProgressSteps step={2} />
        <Text style={styles.formTitle}>Select a Category for Your Shop</Text>
        <Text style={styles.formHint}>Choose the main category that best describes what you sell.</Text>
        <View style={styles.selectBox}>
          <Text style={styles.selectLabel}>Main Category</Text>
          <Text style={styles.selectValue}>Clothing & Fashion</Text>
          <Ionicons name="chevron-down" size={17} color={colors.mutedForeground} />
        </View>
        <Text style={[styles.formTitle, styles.addCategoriesTitle]}>Add Product Categories</Text>
        <Text style={styles.formHint}>You can add more later</Text>
        {choices.map((choice) => {
          const checked = selected.includes(choice);
          return (
            <Pressable
              key={choice}
              onPress={() => setSelected((current) => checked ? current.filter((item) => item !== choice) : [...current, choice])}
              style={styles.checkboxRow}
            >
              <View style={[styles.checkbox, checked && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                {checked ? <Ionicons name="checkmark" size={13} color={colors.primaryForeground} /> : null}
              </View>
              <Text style={styles.checkboxText}>{choice}</Text>
            </Pressable>
          );
        })}
        <Pressable style={styles.addCategoryTextRow}>
          <Ionicons name="add" size={16} color={colors.primary} />
          <Text style={[styles.addCategoryText, { color: colors.primary }]}>Add More Categories</Text>
        </Pressable>
        <WizardFooter onNext={onNext} />
      </ScrollView>
    </ScreenShell>
  );
}

function CreateProductScreen({
  products,
  onAdd,
  onBack,
}: {
  products: Product[];
  onAdd: (product: Product) => void;
  onBack: () => void;
}) {
  const colors = useColors();
  const [name, setName] = useState('Faith Over Fear Hoodie');
  const [price, setPrice] = useState('25.00');
  const [quantity, setQuantity] = useState('10');
  const [description, setDescription] = useState('Comfortable hoodie with a positive message. Made from high-quality cotton.');
  const [error, setError] = useState('');
  const field = (label: string, value: string, onChangeText: (value: string) => void, keyboardType?: KeyboardTypeOptions) => (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} keyboardType={keyboardType} style={styles.formInput} placeholderTextColor={colors.mutedForeground} />
    </View>
  );
  return (
    <ScreenShell screen="myShop" onNav={() => undefined} showNav={false}>
      <KeyboardAwareScrollViewCompat contentContainerStyle={styles.wizardContent} bottomOffset={80}>
        <AppHeader title="Create Your Shop" onBack={onBack} />
        <ProgressSteps step={3} />
        <Text style={styles.formTitle}>Add Product</Text>
        {field('Product Name', name, setName)}
        {field('Category', "Men's Clothing", () => undefined)}
        <View style={styles.twoFields}>
          <View style={styles.halfField}>{field('Price (USD)', price, setPrice, 'decimal-pad')}</View>
          <View style={styles.halfField}>{field('Quantity', quantity, setQuantity, 'number-pad')}</View>
        </View>
        {field('Description', description, setDescription)}
        <Pressable style={[styles.uploadButton, { borderColor: colors.primary }]}>
          <Ionicons name="camera-outline" size={18} color={colors.primary} />
          <Text style={[styles.uploadText, { color: colors.primary }]}>Upload Image</Text>
        </Pressable>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <WizardFooter
          onCancel={onBack}
          onNext={() => {
            const parsed = Number(price);
            const stock = Number(quantity);
            if (!name.trim() || !Number.isFinite(parsed) || parsed <= 0 || !Number.isFinite(stock) || stock < 0) {
              setError('Add a product name, a valid price, and a quantity.');
              return;
            }
            onAdd({
              id: `product-${Date.now()}`,
              name: name.trim(),
              category: "Men's Clothing",
              price: parsed,
              stock,
              description,
              image: assets.hoodie,
            });
          }}
        />
        <Pressable onPress={() => setError(`You already have ${products.length} products. Add another with the form above.`)} style={styles.anotherProduct}>
          <Ionicons name="add" size={15} color={colors.primary} />
          <Text style={[styles.anotherProductText, { color: colors.primary }]}>Add Another Product</Text>
        </Pressable>
      </KeyboardAwareScrollViewCompat>
    </ScreenShell>
  );
}

function ManageProductsScreen({
  products,
  onNavigate,
  onRemove,
  onSelect,
}: {
  products: Product[];
  onNavigate: (screen: Screen) => void;
  onRemove: (id: string) => void;
  onSelect: (product: Product) => void;
}) {
  const colors = useColors();
  return (
    <ScreenShell screen="myShop" onNav={onNavigate} showNav={false}>
      <ScrollView contentContainerStyle={styles.wizardContent}>
        <AppHeader title="My Shop" onBack={() => onNavigate('myShop')} />
        <View style={styles.manageShopHeader}>
          <ShopBadge />
          <View style={styles.shopListCopy}>
            <Text style={styles.shopName}>Glory of God Shop</Text>
            <Text style={styles.shopMeta}>Faith  •  Quality  •  Style</Text>
            <Text style={[styles.activeStatus, { color: colors.green }]}>● Active</Text>
          </View>
          <Pressable onPress={() => onNavigate('shopView')} style={[styles.outlineSmallButton, { borderColor: colors.primary }]}>
            <Text style={[styles.outlineSmallText, { color: colors.primary }]}>View Store</Text>
          </Pressable>
        </View>
        <View style={styles.manageTabs}>
          <Text style={[styles.manageTabActive, { color: colors.primary }]}>Products</Text>
          <Text style={styles.manageTab}>Categories</Text>
          <Text style={styles.manageTab}>Settings</Text>
        </View>
        <Text style={styles.formTitle}>Products ({products.length})</Text>
        {products.map((product) => (
          <Pressable key={product.id} onPress={() => onSelect(product)} style={({ pressed }) => [styles.manageProductCard, pressed && styles.pressed]}>
            <Image source={product.image} style={styles.manageProductImage} resizeMode="cover" />
            <View style={styles.manageProductCopy}>
              <Text numberOfLines={1} style={styles.productName}>{product.name}</Text>
              <Text style={styles.managePrice}>${product.price.toFixed(2)}  •  {product.stock} in stock</Text>
              <View style={styles.manageActions}>
                <Pressable onPress={() => onSelect(product)} style={[styles.editButton, { borderColor: colors.primary }]}>
                  <Text style={[styles.editText, { color: colors.primary }]}>Edit</Text>
                </Pressable>
                <Pressable onPress={() => onRemove(product.id)} style={styles.removeButton}>
                  <Ionicons name="trash-outline" size={13} color={colors.destructive} />
                  <Text style={[styles.removeText, { color: colors.destructive }]}>Remove</Text>
                </Pressable>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={17} color={colors.mutedForeground} />
          </Pressable>
        ))}
        <Pressable onPress={() => onNavigate('createProduct')} style={[styles.primaryButton, { backgroundColor: colors.primary, marginTop: 6 }]}>
          <Ionicons name="add" size={18} color={colors.primaryForeground} />
          <Text style={styles.primaryButtonText}>Add Product</Text>
        </Pressable>
      </ScrollView>
    </ScreenShell>
  );
}

function ManageCategoriesScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const colors = useColors();
  const categoryRows = [
    ["Men's Clothing", '12 products', 'shirt-outline'],
    ["Women's Clothing", '8 products', 'shirt-outline'],
    ['Shoes', '6 products', 'footsteps-outline'],
    ['Accessories', '4 products', 'watch-outline'],
    ['Bags', '3 products', 'bag-outline'],
  ];
  return (
    <ScreenShell screen="myShop" onNav={onNavigate} showNav={false}>
      <ScrollView contentContainerStyle={styles.wizardContent}>
        <AppHeader title="Manage Categories" onBack={() => onNavigate('myShop')} />
        {categoryRows.map(([name, count, icon]) => (
          <View key={name} style={styles.categoryManageRow}>
            <View style={[styles.categoryManageIcon, { backgroundColor: colors.softBlue }]}>
              <Ionicons name={icon as never} size={18} color={colors.primary} />
            </View>
            <View style={styles.categoryManageCopy}>
              <Text style={styles.manageCategoryName}>{name}</Text>
              <Text style={styles.manageCategoryCount}>{count}</Text>
            </View>
            <Pressable style={[styles.editButton, { borderColor: colors.primary }]}>
              <Text style={[styles.editText, { color: colors.primary }]}>Edit</Text>
            </Pressable>
            <Pressable style={styles.deleteIcon}>
              <Ionicons name="trash-outline" size={16} color={colors.destructive} />
            </Pressable>
          </View>
        ))}
        <Pressable style={[styles.outlineWideButton, { borderColor: colors.primary }]}>
          <Ionicons name="add" size={18} color={colors.primary} />
          <Text style={[styles.outlineWideText, { color: colors.primary }]}>Add Category</Text>
        </Pressable>
      </ScrollView>
    </ScreenShell>
  );
}

function ShopViewScreen({
  products,
  onNavigate,
  onProduct,
}: {
  products: Product[];
  onNavigate: (screen: Screen) => void;
  onProduct: (product: Product) => void;
}) {
  const colors = useColors();
  const [following, setFollowing] = useState(false);
  return (
    <ScreenShell screen="browse" onNav={onNavigate}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader title="Glory of God Shop" onBack={() => onNavigate('browse')} right={<IconButton name="share-outline" color={colors.navy} accessibilityLabel="Share shop" />} />
        <Image source={assets.banner} style={styles.shopCover} resizeMode="cover" />
        <View style={styles.shopViewHeading}>
          <ShopBadge />
          <View style={styles.shopViewCopy}>
            <Text style={styles.shopViewName}>Glory of God Shop</Text>
            <Text style={styles.shopMeta}>Faith  •  Quality  •  Style</Text>
            <Text style={styles.rating}>★ <Text style={styles.ratingText}>4.8 (12 reviews)  •  2.3 km away</Text></Text>
          </View>
          <Pressable onPress={() => setFollowing((current) => !current)} style={[styles.followButton, { backgroundColor: following ? colors.green : colors.primary }]}>
            <Text style={styles.followText}>{following ? 'Following' : 'Follow'}</Text>
          </Pressable>
        </View>
        <View style={styles.shopTabs}>
          {['Products', 'About', 'Reviews'].map((tab, index) => (
            <Text key={tab} style={[styles.shopTabText, index === 0 && { color: colors.primary, borderBottomColor: colors.primary, borderBottomWidth: 2 }]}>{tab}</Text>
          ))}
        </View>
        <SearchBar value="" onPress={() => undefined} placeholder="Search in this shop..." />
        <View style={styles.shopFilters}>
          {['All', "Men's Clothing", "Women's Clothing", 'Shoes'].map((item, index) => (
            <View key={item} style={[styles.shopFilter, index === 0 && { backgroundColor: colors.primary }]}>
              <Text style={[styles.shopFilterText, index === 0 && { color: colors.primaryForeground }]}>{item}</Text>
            </View>
          ))}
        </View>
        <View style={styles.productGrid}>
          {products.map((product) => <ProductCard key={product.id} product={product} onPress={() => onProduct(product)} compact />)}
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

function ProductDetailScreen({
  product,
  onBack,
  onNavigate,
}: {
  product: Product;
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  const colors = useColors();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  return (
    <ScreenShell screen="browse" onNav={onNavigate} showNav={false}>
      <ScrollView contentContainerStyle={styles.detailContent}>
        <AppHeader
          title=""
          onBack={onBack}
          right={
            <View style={styles.detailHeaderActions}>
              <IconButton name="share-outline" color={colors.navy} accessibilityLabel="Share product" />
              <IconButton name="heart-outline" color={colors.navy} accessibilityLabel="Save product" />
            </View>
          }
        />
        <Image source={product.image} style={styles.detailImage} resizeMode="cover" />
        <View style={styles.detailThumbs}>
          {[product.image, assets.hoodie, assets.sneakers].map((image, index) => (
            <View key={index} style={[styles.detailThumb, index === 0 && { borderColor: colors.primary }]}>
              <Image source={image} style={styles.detailThumbImage} resizeMode="cover" />
            </View>
          ))}
        </View>
        <Text style={styles.detailName}>{product.name}</Text>
        <Text style={styles.detailMeta}>{product.category}  •  Hoodies</Text>
        <Text style={styles.rating}>★ <Text style={styles.ratingText}>4.8 (12 reviews)</Text></Text>
        <Money value={product.price} large />
        <Text style={[styles.stockText, { color: colors.green }]}>In stock: {product.stock}</Text>
        <View style={styles.quantityRow}>
          <Pressable onPress={() => setQuantity((current) => Math.max(1, current - 1))} style={styles.quantityButton}><Ionicons name="remove" size={16} color={colors.navy} /></Pressable>
          <Text style={styles.quantityValue}>{quantity}</Text>
          <Pressable onPress={() => setQuantity((current) => Math.min(product.stock, current + 1))} style={styles.quantityButton}><Ionicons name="add" size={16} color={colors.navy} /></Pressable>
        </View>
        <Pressable
          testID="add-to-cart"
          onPress={() => {
            tap();
            setAdded(true);
          }}
          style={[styles.primaryButton, styles.addToCartButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name={added ? 'checkmark' : 'cart-outline'} size={18} color={colors.primaryForeground} />
          <Text style={styles.primaryButtonText}>{added ? 'Added to Cart' : 'Add to Cart'}</Text>
        </Pressable>
        <View style={styles.descriptionBlock}>
          <Text style={styles.detailSectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>
        <View style={styles.detailShopCard}>
          <ShopBadge />
          <View style={styles.shopListCopy}>
            <Text style={styles.shopName}>Glory of God Shop</Text>
            <Text style={styles.shopMeta}>Faith  •  Quality  •  Style</Text>
          </View>
          <Pressable onPress={() => onNavigate('shopView')} style={[styles.outlineSmallButton, { borderColor: colors.primary }]}>
            <Text style={[styles.outlineSmallText, { color: colors.primary }]}>View Shop</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenShell>
  );
}

export default function DoorstepMarket() {
  const [screen, setScreen] = useState<Screen>('home');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product>(initialProducts[0]);

  useEffect(() => {
    AsyncStorage.getItem('doorstep-products').then((stored) => {
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Product[];
          setProducts(parsed.map((product) => ({ ...product, image: product.id === 'sneakers' ? assets.sneakers : assets.hoodie })));
        } catch {
          // Keep the curated local catalog if persisted data is invalid.
        }
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('doorstep-products', JSON.stringify(products)).catch(() => undefined);
  }, [products]);

  const goTo = (next: Screen) => {
    tap();
    setScreen(next);
  };

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setScreen('productDetail');
  };

  const screenContent = useMemo(() => {
    switch (screen) {
      case 'home':
        return <HomeScreen onNavigate={goTo} />;
      case 'browse':
        return <BrowseScreen products={products} onNavigate={goTo} onProduct={openProduct} />;
      case 'myShop':
        return <MyShopScreen onNavigate={goTo} />;
      case 'account':
        return <AccountScreen onNavigate={goTo} />;
      case 'createInfo':
        return <CreateInfoScreen onNext={() => goTo('createCategory')} onBack={() => goTo('myShop')} />;
      case 'createCategory':
        return <CreateCategoryScreen onNext={() => goTo('createProduct')} onBack={() => goTo('createInfo')} />;
      case 'createProduct':
        return <CreateProductScreen products={products} onAdd={(product) => { setProducts((current) => [...current, product]); goTo('manageProducts'); }} onBack={() => goTo('myShop')} />;
      case 'manageProducts':
        return <ManageProductsScreen products={products} onNavigate={goTo} onRemove={(id) => setProducts((current) => current.filter((product) => product.id !== id))} onSelect={openProduct} />;
      case 'manageCategories':
        return <ManageCategoriesScreen onNavigate={goTo} />;
      case 'shopView':
        return <ShopViewScreen products={products} onNavigate={goTo} onProduct={openProduct} />;
      case 'productDetail':
        return <ProductDetailScreen product={selectedProduct} onBack={() => goTo('browse')} onNavigate={goTo} />;
    }
  }, [products, screen, selectedProduct]);

  return screenContent;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F7F9FD' },
  scrollContent: { paddingBottom: 100 },
  header: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, gap: 10, backgroundColor: '#F7F9FD' },
  brandMark: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  headerCopy: { flex: 1 },
  headerTitle: { color: '#102348', fontSize: 17, fontFamily: 'Inter_700Bold' },
  headerSubtitle: { color: '#71809A', fontSize: 10, marginTop: 2, fontFamily: 'Inter_500Medium' },
  headerSpacer: { width: 36 },
  iconButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.72 },
  heroBanner: { height: 166, marginHorizontal: 14, borderRadius: 12, overflow: 'hidden', backgroundColor: '#102348' },
  heroImage: { width: '100%', height: '100%' },
  heroShade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(16,35,72,0.58)' },
  heroCopy: { position: 'absolute', left: 16, top: 19 },
  heroTitle: { color: '#FFFFFF', fontSize: 21, lineHeight: 24, fontFamily: 'Inter_700Bold' },
  heroSubtitle: { color: '#E8F0FF', fontSize: 10, lineHeight: 14, marginTop: 9, fontFamily: 'Inter_500Medium' },
  searchBar: { height: 43, marginHorizontal: 14, marginTop: 15, borderWidth: 1, borderColor: '#D8E1EF', borderRadius: 9, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', gap: 8 },
  searchInput: { flex: 1, color: '#102348', fontFamily: 'Inter_500Medium', fontSize: 12, paddingVertical: 0 },
  sectionTitleRow: { paddingHorizontal: 16, marginTop: 19, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { color: '#102348', fontSize: 14, fontFamily: 'Inter_700Bold' },
  sectionAction: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  categoryGrid: { paddingHorizontal: 13, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryItem: { width: '24%', alignItems: 'center', marginBottom: 13 },
  categoryIcon: { width: 45, height: 45, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  categoryLabel: { color: '#50617C', fontSize: 9, textAlign: 'center', lineHeight: 12, marginTop: 5, minHeight: 24, fontFamily: 'Inter_500Medium' },
  shopListCard: { marginHorizontal: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8E1EF', borderRadius: 10, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  shopBadge: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  shopBadgeCross: { color: '#F2B134', fontSize: 19, lineHeight: 18, fontFamily: 'Inter_700Bold' },
  shopBadgeGod: { color: '#FFFFFF', fontSize: 11, lineHeight: 12, fontFamily: 'Inter_700Bold' },
  shopListCopy: { flex: 1 },
  shopName: { color: '#102348', fontSize: 12, fontFamily: 'Inter_700Bold' },
  shopMeta: { color: '#71809A', fontSize: 10, marginTop: 4, fontFamily: 'Inter_500Medium' },
  rating: { color: '#F2B134', fontSize: 11, marginTop: 6, fontFamily: 'Inter_700Bold' },
  ratingText: { color: '#71809A', fontFamily: 'Inter_500Medium' },
  distance: { color: '#71809A', fontSize: 9, marginTop: 3 },
  money: { color: '#102348', fontSize: 12, marginTop: 4, fontFamily: 'Inter_700Bold' },
  moneyLarge: { fontSize: 21, marginTop: 11 },
  bottomNav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 72, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E3EAF3', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 },
  navItem: { alignItems: 'center', gap: 4, width: '25%' },
  navLabel: { color: '#71809A', fontSize: 9, fontFamily: 'Inter_500Medium' },
  filterRow: { paddingHorizontal: 14, flexDirection: 'row', gap: 8, marginTop: 13 },
  filterChip: { paddingHorizontal: 12, height: 29, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF3FA' },
  filterText: { color: '#50617C', fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  browseShopCard: { marginHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: '#D8E1EF', backgroundColor: '#FFFFFF', padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  outlineSmallButton: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6 },
  outlineSmallText: { fontSize: 9, fontFamily: 'Inter_700Bold' },
  productGrid: { paddingHorizontal: 14, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  productCard: { width: '48.3%', borderRadius: 9, borderWidth: 1, borderColor: '#D8E1EF', backgroundColor: '#FFFFFF', padding: 7, overflow: 'hidden' },
  productCardCompact: { width: '48.3%' },
  productImageWrap: { height: 122, borderRadius: 7, overflow: 'hidden', backgroundColor: '#F1F4F9', position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  cartBubble: { position: 'absolute', right: 5, bottom: 5, width: 25, height: 25, borderRadius: 13, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  productName: { color: '#102348', fontSize: 10, marginTop: 7, fontFamily: 'Inter_600SemiBold' },
  productRating: { color: '#71809A', fontSize: 8, marginTop: 4 },
  stockText: { fontSize: 9, marginTop: 3, fontFamily: 'Inter_600SemiBold' },
  myShopCard: { marginHorizontal: 14, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#D8E1EF', backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 10 },
  activeStatus: { fontSize: 9, marginTop: 5, fontFamily: 'Inter_600SemiBold' },
  actionCard: { marginHorizontal: 14, marginTop: 12, padding: 14, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionIcon: { width: 45, height: 45, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  actionCopy: { flex: 1 },
  actionTitle: { color: '#102348', fontSize: 12, fontFamily: 'Inter_700Bold' },
  actionSubtitle: { color: '#71809A', fontSize: 10, lineHeight: 14, marginTop: 3, fontFamily: 'Inter_500Medium' },
  manageLinks: { marginTop: 13, marginHorizontal: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8E1EF', borderRadius: 10 },
  manageLink: { minHeight: 52, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#EEF2F7', flexDirection: 'row', alignItems: 'center', gap: 11 },
  manageLinkText: { flex: 1, color: '#102348', fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  accountHero: { alignItems: 'center', paddingVertical: 28 },
  avatar: { width: 78, height: 78, borderRadius: 39, alignItems: 'center', justifyContent: 'center' },
  accountName: { color: '#102348', fontSize: 18, marginTop: 12, fontFamily: 'Inter_700Bold' },
  accountSub: { color: '#71809A', fontSize: 11, marginTop: 4 },
  wizardContent: { paddingBottom: 40 },
  progressRow: { paddingHorizontal: 19, marginTop: 14, marginBottom: 29, flexDirection: 'row', alignItems: 'flex-start' },
  progressItem: { alignItems: 'center', width: 50 },
  progressCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: '#C7D2E2', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  progressNumber: { color: '#71809A', fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  progressLabel: { color: '#71809A', fontSize: 8, textAlign: 'center', marginTop: 5, lineHeight: 10 },
  progressLine: { flex: 1, height: 1, backgroundColor: '#D8E1EF', marginTop: 11 },
  formTitle: { marginHorizontal: 17, color: '#102348', fontSize: 14, fontFamily: 'Inter_700Bold' },
  formHint: { marginHorizontal: 17, color: '#71809A', fontSize: 10, lineHeight: 14, marginTop: 5 },
  formInput: { height: 42, borderWidth: 1, borderColor: '#CBD7E8', borderRadius: 7, backgroundColor: '#FFFFFF', marginHorizontal: 17, marginTop: 9, paddingHorizontal: 11, color: '#102348', fontSize: 11, fontFamily: 'Inter_500Medium' },
  wizardSpacer: { minHeight: 270 },
  wizardFooter: { flexDirection: 'row', marginHorizontal: 17, gap: 9, marginTop: 26 },
  cancelButton: { flex: 1, height: 43, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  primaryButton: { height: 43, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7, paddingHorizontal: 17 },
  primaryButtonFull: { flex: 1 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 11, fontFamily: 'Inter_700Bold' },
  selectBox: { marginHorizontal: 17, height: 55, borderWidth: 1, borderColor: '#CBD7E8', borderRadius: 7, marginTop: 13, paddingHorizontal: 10, justifyContent: 'center' },
  selectLabel: { color: '#71809A', fontSize: 8 },
  selectValue: { color: '#102348', fontSize: 11, marginTop: 3, flex: 1 },
  addCategoriesTitle: { marginTop: 22 },
  checkboxRow: { marginHorizontal: 17, height: 34, flexDirection: 'row', alignItems: 'center', gap: 9 },
  checkbox: { width: 15, height: 15, borderRadius: 3, borderWidth: 1, borderColor: '#B9C6D8', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  checkboxText: { color: '#50617C', fontSize: 11, fontFamily: 'Inter_500Medium' },
  addCategoryTextRow: { marginHorizontal: 17, marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 4 },
  addCategoryText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  fieldBlock: { marginTop: 13 },
  fieldLabel: { marginHorizontal: 17, color: '#50617C', fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  twoFields: { flexDirection: 'row', gap: 9, marginHorizontal: 0 },
  halfField: { flex: 1 },
  uploadButton: { height: 38, marginHorizontal: 17, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6, marginTop: 14 },
  uploadText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  errorText: { color: '#D94F61', fontSize: 10, marginHorizontal: 17, marginTop: 8 },
  anotherProduct: { flexDirection: 'row', gap: 3, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  anotherProductText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  manageShopHeader: { marginHorizontal: 14, padding: 12, borderWidth: 1, borderColor: '#D8E1EF', borderRadius: 10, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 10 },
  manageTabs: { marginHorizontal: 14, marginTop: 18, borderBottomWidth: 1, borderBottomColor: '#D8E1EF', flexDirection: 'row', justifyContent: 'space-around' },
  manageTabActive: { paddingBottom: 9, fontSize: 11, fontFamily: 'Inter_700Bold' },
  manageTab: { color: '#71809A', paddingBottom: 9, fontSize: 11, fontFamily: 'Inter_500Medium' },
  manageProductCard: { marginHorizontal: 14, marginTop: 9, padding: 8, borderWidth: 1, borderColor: '#D8E1EF', borderRadius: 9, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 9 },
  manageProductImage: { width: 58, height: 58, borderRadius: 6, backgroundColor: '#F1F4F9' },
  manageProductCopy: { flex: 1 },
  managePrice: { color: '#50617C', fontSize: 9, marginTop: 4 },
  manageActions: { flexDirection: 'row', gap: 7, marginTop: 7 },
  editButton: { borderRadius: 5, borderWidth: 1, paddingHorizontal: 9, paddingVertical: 4 },
  editText: { fontSize: 8, fontFamily: 'Inter_700Bold' },
  removeButton: { borderRadius: 5, borderWidth: 1, borderColor: '#F1C6CE', paddingHorizontal: 7, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 3 },
  removeText: { fontSize: 8, fontFamily: 'Inter_700Bold' },
  categoryManageRow: { marginHorizontal: 14, marginTop: 9, padding: 10, borderWidth: 1, borderColor: '#D8E1EF', borderRadius: 9, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 9 },
  categoryManageIcon: { width: 35, height: 35, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  categoryManageCopy: { flex: 1 },
  manageCategoryName: { color: '#102348', fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  manageCategoryCount: { color: '#71809A', fontSize: 9, marginTop: 3 },
  deleteIcon: { width: 27, height: 27, borderRadius: 5, backgroundColor: '#FFF0F2', alignItems: 'center', justifyContent: 'center' },
  outlineWideButton: { marginHorizontal: 14, marginTop: 15, height: 42, borderWidth: 1, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  outlineWideText: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  shopCover: { width: '100%', height: 156, marginTop: 1 },
  shopViewHeading: { marginHorizontal: 15, marginTop: -20, padding: 11, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D8E1EF', flexDirection: 'row', alignItems: 'center', gap: 9 },
  shopViewCopy: { flex: 1 },
  shopViewName: { color: '#102348', fontSize: 13, fontFamily: 'Inter_700Bold' },
  followButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  followText: { color: '#FFFFFF', fontSize: 10, fontFamily: 'Inter_700Bold' },
  shopTabs: { marginTop: 17, marginHorizontal: 14, flexDirection: 'row', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#D8E1EF' },
  shopTabText: { color: '#71809A', fontSize: 11, paddingBottom: 9, paddingHorizontal: 13, fontFamily: 'Inter_600SemiBold' },
  shopFilters: { paddingHorizontal: 14, flexDirection: 'row', gap: 5, marginTop: 10, marginBottom: 12 },
  shopFilter: { borderRadius: 14, backgroundColor: '#EEF3FA', paddingHorizontal: 8, paddingVertical: 6 },
  shopFilterText: { color: '#50617C', fontSize: 8 },
  detailContent: { paddingBottom: 32 },
  detailHeaderActions: { flexDirection: 'row', gap: 1 },
  detailImage: { width: '100%', height: 320, backgroundColor: '#F1F4F9' },
  detailThumbs: { flexDirection: 'row', gap: 7, paddingHorizontal: 14, marginTop: 10 },
  detailThumb: { width: 53, height: 53, borderRadius: 6, borderWidth: 1, borderColor: '#D8E1EF', overflow: 'hidden' },
  detailThumbImage: { width: '100%', height: '100%' },
  detailName: { marginHorizontal: 17, marginTop: 19, color: '#102348', fontSize: 17, fontFamily: 'Inter_700Bold' },
  detailMeta: { marginHorizontal: 17, color: '#71809A', fontSize: 10, marginTop: 4 },
  quantityRow: { height: 39, marginHorizontal: 17, marginTop: 14, borderWidth: 1, borderColor: '#D8E1EF', borderRadius: 7, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: 104 },
  quantityButton: { width: 34, alignItems: 'center', justifyContent: 'center' },
  quantityValue: { color: '#102348', fontSize: 12, fontFamily: 'Inter_700Bold' },
  addToCartButton: { marginHorizontal: 17, marginTop: 14 },
  descriptionBlock: { marginHorizontal: 17, marginTop: 21, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#E3EAF3' },
  detailSectionTitle: { color: '#102348', fontSize: 12, fontFamily: 'Inter_700Bold' },
  descriptionText: { color: '#50617C', fontSize: 10, lineHeight: 15, marginTop: 6 },
  detailShopCard: { marginHorizontal: 17, marginTop: 17, padding: 11, borderWidth: 1, borderColor: '#D8E1EF', borderRadius: 9, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', gap: 9 },
});