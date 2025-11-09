
import { createContext, useCallback, useContext, useMemo, useState } from "react"


// 考点：
//  1. context 状态管理
//  2. e.preventDefault() 阻止键盘的默认行为 e.stopPropergation 阻止事件冒泡
//  3. 无障碍访问 role tabIndex, Enter. Escape
//  4. 懒加载数据
const AccordionContext = createContext({
    activeKey: '',
    handleToggle: (key: string) => { }
})

interface CardItem {
    title?: string;
    children?: React.ReactNode;
    cardKey: string;
    className?: string;
    defaultExpanded?: boolean;
}

interface AccordionProps {
    children?: React.ReactNode;
    className?: string;
}


interface CardProps extends CardItem {
    onLoadData?: () => Promise<any>
}


const Accordion = ({ children, className = '' }: AccordionProps) => {
    const [activeKey, setActiveKey] = useState<string>('');
    const handleToggle = useCallback((key: string) => {
        setActiveKey(key)
    }, [])

    return <AccordionContext.Provider value={{ activeKey, handleToggle }} >
        <div className={`accordion ${className}`}>
            {children}
        </div>
    </AccordionContext.Provider>
}


const Card = function (props: CardProps) {

    const { title = 'title', children, cardKey, defaultExpanded, className, onLoadData } = props
    const { activeKey, handleToggle } = useContext(AccordionContext)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [loadedData, setLoadedData] = useState(null)
    const hasLoaded = loadedData !== null;

    const isExpanded = useMemo(() => {
        if (activeKey) {
            return activeKey === cardKey
        }
        return defaultExpanded;
    }, [])

    const toggleCard = useCallback(async () => {

        const willExpand = activeKey !== cardKey;

        handleToggle(cardKey)


        if (willExpand && onLoadData && !hasLoaded && !loading && !error) {
            // 展开 + 数据未加载 + 不在 loading 中，没有错误
            setLoading(true);
            setError(null);

            try {
                const data = await onLoadData();
                setLoadedData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false)
            }
        }

    }, [cardKey, handleToggle, activeKey, hasLoaded, loading, error, onLoadData])

    const handleRetry = useCallback((e) => {
        e.stopPropagation();

        setLoading(true);
        setError(null);
        onLoadData?.().then(setLoadedData).catch(err => setError(err)).finally(() => {
            setLoading(false)
        })
    }, [])



    return <div className={`card ${className} ${isExpanded ? 'expanded' : ''}`}>
        <div className="card-header" onClick={toggleCard} role="button" tabIndex={0} onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === '') {
                e.preventDefault();

                toggleCard();
            }
        }}>
            <h3 className="card-title">{title}</h3>
            <span className="card-toggle">
                {isExpanded ? '-' : '+'}
            </span>
        </div>
        <div className={`card-content ${isExpanded ? 'visible' : 'hidden'}`}>
            {loading && <div className="card-loading">loading...</div>}

            {error && (<div>
                <span>{error}</span>
                <button onClick={handleRetry}>retry</button>
            </div>)}

            {!loading && !error && (
                <>
                    {children}
                    <div>
                        {typeof loadedData === 'string' ? (<p>{loadedData}</p>) : <pre>{JSON.stringify(loadedData, null, 2)}</pre>}
                    </div>
                </>
            )}
        </div>
    </div>
}

export { Card, Accordion }